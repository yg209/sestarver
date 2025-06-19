const hre = require("hardhat");

async function main() {
  const [deployer, arbiter, beneficiary] = await hre.ethers.getSigners();

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    arbiter.address,
    beneficiary.address,
    { value: hre.ethers.parseEther("1.0") }
  );

  await escrow.waitForDeployment();

  console.log(`✅ Escrow deployed at: ${await escrow.getAddress()}`);
  console.log(`   Arbiter: ${arbiter.address}`);
  console.log(`   Beneficiary: ${beneficiary.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});