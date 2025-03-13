// const hre = require("hardhat");

// async function pair() {
//   const [deployer] = await hre.ethers.getSigners();
//   console.log("Deploying contracts with:", deployer.address);

// //   // Deploy Test Tokens
// //   const TestToken = await hre.ethers.getContractFactory("TestToken");
// //   // const WMON = await TestToken.deploy(hre.ethers.parseEther("1000000"));
// //   const tokenB = await TestToken.deploy(hre.ethers.parseEther("1000000"));
// //   // await WMON.waitForDeployment();
// //   await tokenB.waitForDeployment();
// //   // console.log("WMON deployed to:", await WMON.getAddress());
// //   console.log("MONs deployed to:", await tokenB.getAddress());

//   // Deploy Factory
//   const MonSwapFactory = await hre.ethers.getContractFactory("MonSwapFactory");
//   const factory = await MonSwapFactory.deploy(deployer.address);
//   await factory.waitForDeployment();
//   console.log("Factory deployed to:", await factory.getAddress());

//   // // Create Pair
//   await factory.createPair("0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701", "0x414C48Ce59EC0B3083537aA885934c6b23541F17");
//   const pairAddress = await factory.getPair("0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701", "0x414C48Ce59EC0B3083537aA885934c6b23541F17");
//   console.log("Pair created at:", pairAddress);

  // const pair = await hre.ethers.getContractAt("MonSwapPair", pairAddress);
// }

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Connect to existing contracts
  const WMON = await hre.ethers.getContractAt("TestToken", "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701");
  const tokenB = await hre.ethers.getContractAt("TestToken", process.env.TOKEN_B);
  const factory = await hre.ethers.getContractAt("MonSwapFactory", process.env.FACTORY);
  const pairAddress = process.env.PAIR;
  const pair = await hre.ethers.getContractAt("MonSwapPair", pairAddress);

  console.log("Connected to WMON at:", await WMON.getAddress());
  console.log("Connected to MONs at:", await tokenB.getAddress());
  console.log("Connected to Factory at:", await factory.getAddress());
  console.log("Connected to Pair at:", pairAddress);

  // Approve tokens for Pair (ถ้ายังไม่ได้ approve)
  // await WMON.approve(pairAddress, hre.ethers.parseEther("1000"));
  // await tokenB.approve(pairAddress, hre.ethers.parseEther("1000"));
  // console.log("Tokens approved");

  // Add liquidity (ถ้ายังไม่มี liquidity หรือเพิ่มได้)
  // await WMON.transfer(pairAddress, hre.ethers.parseEther("0.01"));
  // await tokenB.transfer(pairAddress, hre.ethers.parseEther("1000"));
  // await pair.mint(deployer.address);
  // console.log("Liquidity added");

  // Check reserves before swap
  const reservesBefore = await pair.getReserves();
  console.log(reservesBefore)
  console.log("Reserves before swap:", hre.ethers.formatEther(reservesBefore[0]), hre.ethers.formatEther(reservesBefore[1]));

  // Test swap: Swap 0.01 WMON for MONs
  const amountIn = hre.ethers.parseEther("0.01");

  // อ่าน reserves ของ pair

  const monsReserve = reservesBefore[0]; // สมมติ MONs อยู่ที่ index 0
  const wmonReserve = reservesBefore[1]; // สมมติ WMON อยู่ที่ index 1

  // คำนวณจำนวน token ที่จะได้รับหลังหักค่าธรรมเนียม
  const amountInWithFee = (amountIn * BigInt(997)) / BigInt(1000); // 0.3% fee
  const amountOut = (monsReserve * amountInWithFee) / (wmonReserve + amountInWithFee);

  // โอน WMON เข้า pair ก่อน swap
  await WMON.transfer(pairAddress, amountIn);

  // ทำการ swap: 0.01 WMON → MONs
  await pair.swap(amountOut, 0, deployer.address, "0x");

  // แสดงผลลัพธ์
  console.log(`Swap completed: 0.01 WMON -> ${hre.ethers.formatEther(amountOut)} MONs`);


  // Check reserves and balance after swap
  const reservesAfterSwap = await pair.getReserves();
  let balanceA = await WMON.balanceOf(deployer.address);
  let balanceB = await tokenB.balanceOf(deployer.address);
  console.log("Reserves after swap:", hre.ethers.formatEther(reservesAfterSwap[0]),"MONs", hre.ethers.formatEther(reservesAfterSwap[1]), "WMON");
  console.log("Deployer balance after swap - WMON:", hre.ethers.formatEther(balanceA), "MONs:", hre.ethers.formatEther(balanceB));

  //Test burn: Withdraw liquidity
  const lpBalance = await pair.balanceOf(deployer.address);
  await pair.approve(pairAddress, lpBalance);
  await pair.transfer(pairAddress, lpBalance);
  await pair.burn(deployer.address);
  console.log("Liquidity burned");

  // Check final balance and reserves
  balanceA = await WMON.balanceOf(deployer.address);
  balanceB = await tokenB.balanceOf(deployer.address);
  console.log("Deployer final balance - WMON:", hre.ethers.formatEther(balanceA), "MONs:", hre.ethers.formatEther(balanceB));
  const reservesAfterBurn = await pair.getReserves();
  console.log("Reserves after burn:", hre.ethers.formatEther(reservesAfterBurn[0]), hre.ethers.formatEther(reservesAfterBurn[1]));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});