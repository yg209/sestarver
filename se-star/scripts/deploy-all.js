const hre = require("hardhat");

async function main() {
  const [deployer, arbiter, beneficiary] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Arbiter: ${arbiter.address}`);
  console.log(`Beneficiary: ${beneficiary.address}`);
  console.log("Deploying contracts...\n");

  // 1. Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(arbiter.address, beneficiary.address, {
    value: hre.ethers.parseEther("1.0"),
  });
  await escrow.waitForDeployment();

  // 2. EscrowVault
  const EscrowVault = await hre.ethers.getContractFactory("EscrowVault");
  const escrowVault = await EscrowVault.deploy(
    deployer.address,
    beneficiary.address,
    arbiter.address,
    { value: hre.ethers.parseEther("1.0") }
  );
  await escrowVault.waitForDeployment();

  // 3. AIAgent
  const AIAgent = await hre.ethers.getContractFactory("AIAgent");
  const aiAgent = await AIAgent.deploy();
  await aiAgent.waitForDeployment();

  // 4. TrustWall
  const TrustWall = await hre.ethers.getContractFactory("TrustWall");
  const trustWall = await TrustWall.deploy();
  await trustWall.waitForDeployment();

  // 5. SEGuard
  const SEGuard = await hre.ethers.getContractFactory("SEGuard");
  const seGuard = await SEGuard.deploy();
  await seGuard.waitForDeployment();

  // 6. CustodyVault
  const CustodyVault = await hre.ethers.getContractFactory("CustodyVault");
  const custodyVault = await CustodyVault.deploy();
  await custodyVault.waitForDeployment();

  console.log("\n✅ All contracts deployed successfully:\n");
  console.log(`🛡️  Escrow:         ${await escrow.getAddress()}`);
  console.log(`🔐 EscrowVault:    ${await escrowVault.getAddress()}`);
  console.log(`🤖 AIAgent:        ${await aiAgent.getAddress()}`);
  console.log(`🧱 TrustWall:      ${await trustWall.getAddress()}`);
  console.log(`🚨 SEGuard:        ${await seGuard.getAddress()}`);
  console.log(`🏦 CustodyVault:   ${await custodyVault.getAddress()}`);
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});