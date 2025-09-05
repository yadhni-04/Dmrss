const hre = require("hardhat");

async function main(){
  const Consent = await hre.ethers.getContractFactory("ConsentManager");
  const consent = await Consent.deploy();
  await consent.deployed();
  console.log("ConsentManager deployed to:", consent.address);
}
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
