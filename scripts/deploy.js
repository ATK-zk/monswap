// const hre = require("hardhat");

// async function main() {
//   const [deployer] = await hre.ethers.getSigners();
//   console.log("Deploying contracts with:", deployer.address);

//   // Deploy Test Tokens
//   const TestToken = await hre.ethers.getContractFactory("TestToken");
//   const tokenA = await TestToken.deploy(hre.ethers.parseEther("1000000"));
//   const tokenB = await TestToken.deploy(hre.ethers.parseEther("1000000"));
//   await tokenA.waitForDeployment();
//   await tokenB.waitForDeployment();
//   console.log("TokenA deployed to:", await tokenA.getAddress());
//   console.log("TokenB deployed to:", await tokenB.getAddress());

//   // Deploy Factory
//   const MonSwapFactory = await hre.ethers.getContractFactory("MonSwapFactory");
//   const factory = await MonSwapFactory.deploy(deployer.address);
//   await factory.waitForDeployment();
//   console.log("Factory deployed to:", await factory.getAddress());

//   // Create Pair
//   await factory.createPair(tokenA.getAddress(), tokenB.getAddress());
//   const pairAddress = await factory.getPair(tokenA.getAddress(), tokenB.getAddress());
//   console.log("Pair created at:", pairAddress);

//   const pair = await hre.ethers.getContractAt("MonSwapPair", pairAddress);

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Connect to existing contracts
  const tokenA = await hre.ethers.getContractAt("TestToken", process.env.TOKEN_A);
  const tokenB = await hre.ethers.getContractAt("TestToken", process.env.TOKEN_B);
  const factory = await hre.ethers.getContractAt("MonSwapFactory", process.env.FACTORY);
  const pairAddress = process.env.PAIR;
  const pair = await hre.ethers.getContractAt("MonSwapPair", pairAddress);

  console.log("Connected to TokenA at:", await tokenA.getAddress());
  console.log("Connected to TokenB at:", await tokenB.getAddress());
  console.log("Connected to Factory at:", await factory.getAddress());
  console.log("Connected to Pair at:", pairAddress);

  // Approve tokens for Pair (ถ้ายังไม่ได้ approve)
  await tokenA.approve(pairAddress, hre.ethers.parseEther("1000"));
  await tokenB.approve(pairAddress, hre.ethers.parseEther("1000"));
  console.log("Tokens approved");

  // Add liquidity (ถ้ายังไม่มี liquidity หรือเพิ่มได้)
  await tokenA.transfer(pairAddress, hre.ethers.parseEther("1000"));
  await tokenB.transfer(pairAddress, hre.ethers.parseEther("1000"));
  await pair.mint(deployer.address);
  console.log("Liquidity added");

  // Check reserves before swap
  const reservesBefore = await pair.getReserves();
  console.log("Reserves before swap:", hre.ethers.formatEther(reservesBefore[0]), hre.ethers.formatEther(reservesBefore[1]));

  // Test swap: Swap 10 TokenA for TokenB
  const amountIn = hre.ethers.parseEther("10");
  const reserve0 = reservesBefore[0];
  const reserve1 = reservesBefore[1];
  const amountInWithFee = (amountIn * BigInt(997)) / BigInt(1000); // 0.3% fee
  const amountOut = (reserve1 * amountInWithFee) / (reserve0 + amountInWithFee);
  await tokenA.transfer(pairAddress, amountIn);
  await pair.swap(0, amountOut, deployer.address, "0x");
  console.log(`Swap completed: 10 TokenA -> ${hre.ethers.formatEther(amountOut)} TokenB`);

  // Check reserves and balance after swap
  const reservesAfterSwap = await pair.getReserves();
  let balanceA = await tokenA.balanceOf(deployer.address);
  let balanceB = await tokenB.balanceOf(deployer.address);
  console.log("Reserves after swap:", hre.ethers.formatEther(reservesAfterSwap[0]), hre.ethers.formatEther(reservesAfterSwap[1]));
  console.log("Deployer balance after swap - TokenA:", hre.ethers.formatEther(balanceA), "TokenB:", hre.ethers.formatEther(balanceB));

  // Test burn: Withdraw liquidity
  // const lpBalance = await pair.balanceOf(deployer.address);
  // await pair.approve(pairAddress, lpBalance);
  // await pair.transfer(pairAddress, lpBalance);
  // await pair.burn(deployer.address);
  // console.log("Liquidity burned");

  // Check final balance and reserves
  balanceA = await tokenA.balanceOf(deployer.address);
  balanceB = await tokenB.balanceOf(deployer.address);
  console.log("Deployer final balance - TokenA:", hre.ethers.formatEther(balanceA), "TokenB:", hre.ethers.formatEther(balanceB));
  const reservesAfterBurn = await pair.getReserves();
  console.log("Reserves after burn:", hre.ethers.formatEther(reservesAfterBurn[0]), hre.ethers.formatEther(reservesAfterBurn[1]));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});