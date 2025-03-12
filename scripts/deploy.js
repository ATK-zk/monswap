const hre = require("hardhat");

async function main() {
  const Test = await hre.ethers.getContractFactory("Test");
  const test = await Test.deploy();
  console.log("Test deployed to:", test.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});