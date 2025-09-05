import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadAbi() {
  // Adjusted to work regardless of relative folder
  const abiPath = path.join(__dirname, "..", "..", "hardhat", "artifacts", "contracts", "ConsentManager.sol", "ConsentManager.json");

  if (!fs.existsSync(abiPath)) {
    throw new Error(
      "Contract ABI not found. Compile & deploy contract first.\n" +
      "Run:\n  cd ../hardhat\n  npx hardhat compile"
    );
  }

  const json = JSON.parse(fs.readFileSync(abiPath));
  return json.abi;
}

export function createContract(rpcUrl, privateKey, contractAddress) {
  if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
    throw new Error("Invalid private key. Must start with 0x and be 64 hex characters.");
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const abi = loadAbi();
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  return { contract, wallet, provider };
}
