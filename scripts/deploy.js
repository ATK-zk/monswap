const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy Test Tokens
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const tokenA = await TestToken.deploy(hre.ethers.parseEther("1000000"));
  const tokenB = await TestToken.deploy(hre.ethers.parseEther("1000000"));
  await tokenA.waitForDeployment(); // เปลี่ยนจาก .deployed() เป็น .waitForDeployment()
  await tokenB.waitForDeployment();
  console.log("TokenA deployed to:", await tokenA.getAddress()); // เปลี่ยนจาก .address เป็น .getAddress()
  console.log("TokenB deployed to:", await tokenB.getAddress());

  // Deploy Factory
  const MonSwapFactory = await hre.ethers.getContractFactory("MonSwapFactory");
  const factory = await MonSwapFactory.deploy(deployer.address);
  await factory.waitForDeployment();
  console.log("Factory deployed to:", await factory.getAddress());

  // Create Pair
  await factory.createPair(tokenA.getAddress(), tokenB.getAddress());
  const pairAddress = await factory.getPair(tokenA.getAddress(), tokenB.getAddress());
  console.log("Pair created at:", pairAddress);

  const pair = await hre.ethers.getContractAt("MonSwapPair", pairAddress);

  // Approve tokens for Pair
  await tokenA.approve(pairAddress, hre.ethers.parseEther("1000"));
  await tokenB.approve(pairAddress, hre.ethers.parseEther("1000"));
  console.log("Tokens approved");

  // Add liquidity
  await tokenA.transfer(pairAddress, hre.ethers.parseEther("1000"));
  await tokenB.transfer(pairAddress, hre.ethers.parseEther("1000"));
  await pair.mint(deployer.address);
  console.log("Liquidity added");

  // Check reserves
  const reserves = await pair.getReserves();
  console.log("Reserves:", reserves[0].toString(), reserves[1].toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});