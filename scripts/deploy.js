const hre = require("hardhat");

async function main() {
  const Test = await hre.ethers.getContractFactory("Test");
  const test = await Test.deploy();
  console.log("Test deployed to:", test.address);

  // ทดสอบเรียกฟังก์ชัน
  await test.setMessage("Hello from Monad Testnet!");
  const message = await test.getMessage();
  console.log("Message:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});