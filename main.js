import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.6.4/+esm";

const btn = document.getElementById("connectBtn");
const output = document.getElementById("walletInfo");

btn.onclick = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    output.textContent = "✅ Connected: " + address;
  } else {
    output.textContent = "❌ MetaMask not detected.";
  }
};
