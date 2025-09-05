// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title ConsentManager - simple consent and metadata registry for medical records (MVP)
contract ConsentManager {
    struct RecordMeta {
        address owner;      // patient
        bytes32 recordId;   // app-level record id
        string cid;         // IPFS CID for encrypted blob
        bytes32 fileHash;   // sha256 of encrypted file
        uint256 createdAt;
    }

    // consent: consentId => details
    struct Consent {
        address patient;
        address grantee;
        bytes32 recordId;
        uint256 validFrom;
        uint256 validUntil;
        bool active;
    }

    mapping(bytes32 => RecordMeta) public records;
    mapping(bytes32 => Consent) public consents;

    event RecordAdded(bytes32 indexed recordId, address indexed owner, string cid, bytes32 fileHash);
    event ConsentGranted(bytes32 indexed consentId, address indexed patient, address indexed grantee, bytes32 recordId, uint256 validUntil);
    event ConsentRevoked(bytes32 indexed consentId);

    // Add a record (called by backend on behalf of clinician; patient is owner param)
    function addRecord(bytes32 recordId, address owner, string calldata cid, bytes32 fileHash) external {
        require(records[recordId].createdAt == 0, "Record exists");
        records[recordId] = RecordMeta(owner, recordId, cid, fileHash, block.timestamp);
        emit RecordAdded(recordId, owner, cid, fileHash);
    }

    // Patient grants consent to a grantee for a specific recordId until validUntil (timestamp)
    function grantConsent(bytes32 consentId, address grantee, bytes32 recordId, uint256 validUntil) external {
        require(records[recordId].createdAt != 0, "Record not found");
        // only patient (owner) can grant
        require(records[recordId].owner == msg.sender, "Only owner can grant");
        consents[consentId] = Consent(msg.sender, grantee, recordId, block.timestamp, validUntil, true);
        emit ConsentGranted(consentId, msg.sender, grantee, recordId, validUntil);
    }

    // Patient revokes consent
    function revokeConsent(bytes32 consentId) external {
        Consent storage c = consents[consentId];
        require(c.patient == msg.sender, "Only patient");
        require(c.active, "Already inactive");
        c.active = false;
        emit ConsentRevoked(consentId);
    }

    // Check if access is allowed
    function isAccessAllowed(address requester, bytes32 recordId) public view returns (bool) {
        // quick check: owner can always access
        RecordMeta storage r = records[recordId];
        if (r.owner == requester) return true;
        // iterate consents (simple approach: caller must know consentId, or index externally)
        // For MVP we require the requester supplies consentId and backend calls the contract to verify.
        return false;
    }

    // Helper: fetch record metadata
    function getRecord(bytes32 recordId) external view returns (address owner, string memory cid, bytes32 fileHash, uint256 createdAt) {
        RecordMeta storage r = records[recordId];
        return (r.owner, r.cid, r.fileHash, r.createdAt);
    }

    // Helper: fetch consent
    function getConsent(bytes32 consentId) external view returns (address patient, address grantee, bytes32 recordId, uint256 validFrom, uint256 validUntil, bool active) {
        Consent storage c = consents[consentId];
        return (c.patient, c.grantee, c.recordId, c.validFrom, c.validUntil, c.active);
    }
}
