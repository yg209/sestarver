import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // Adjust the path as needed

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// TODO: Define your CONTRACTS object here
// Example:
// const CONTRACTS = {
//   Escrow: { address: "0x...", abi: [...] },
//   ...
// };

export default function Dashboard() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [userRole, setUserRole] = useState("viewer");
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [escrowBalance, setEscrowBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [escrowArbiter, setEscrowArbiter] = useState("");
  const [users, setUsers] = useState([]);
  const [arbiterAddress, setArbiterAddress] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const getContractInstance = (name, signerOrProvider) => {
    const contractInfo = CONTRACTS[name];
    if (!contractInfo) return null;
    return new ethers.Contract(contractInfo.address, contractInfo.abi, signerOrProvider);
  };

  const fetchEscrowArbiter = async () => {
    if (!signer) return alert("Please connect your wallet");

    const escrowContract = getContractInstance("Escrow", signer);
    if (!escrowContract) return alert("Escrow contract not found");

    try {
      const arbiterAddr = await escrowContract.arbiter();
      setEscrowArbiter(arbiterAddr);
    } catch (err) {
      console.error("Error fetching arbiter:", err);
      alert("Failed to fetch arbiter");
    }
  };

  const loadEscrowBalance = async () => {
    if (!provider) return;
    try {
      const contract = new ethers.Contract(CONTRACTS.Escrow.address, CONTRACTS.Escrow.abi, provider);
      const balance = await contract.getBalance(); // example read call
      setEscrowBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error loading escrow balance:", error);
    }
  };

  const approveEscrow = async () => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    setLoading(true);
    try {
      const contract = new ethers.Contract(CONTRACTS.Escrow.address, CONTRACTS.Escrow.abi, signer);
      const tx = await contract.approve();
      await tx.wait();
      alert("Escrow approved!");
      loadEscrowBalance(); // refresh balance after tx
    } catch (error) {
      console.error("Error approving escrow:", error);
      alert("Transaction failed");
    }
    setLoading(false);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 🔐 Sign message
    const message = `Login to SE-STAR as ${address}`;
    const signature = await signer.signMessage(message);
    const verifiedAddress = ethers.verifyMessage(message, signature);

    if (verifiedAddress.toLowerCase() !== address.toLowerCase()) {
      return alert("Signature verification failed.");
    }

    setProvider(provider);
    setSigner(signer);
    setConnectedAddress(address);

    await checkOrCreateUser(address);
    await loadUserRole(address);
    determineRole(address);
  };

  const loadUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

const changeRole = async (userId, newRole) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role: newRole });
  await loadUsers(); // Refresh after update
};
 const checkOrCreateUser = async (address) => {
    const userRef = doc(db, "users", address);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user with default role "viewer"
      await setDoc(userRef, { role: "viewer" });
      console.log(`User ${address} registered with role viewer.`);
    }
  };

  const loadUserRole = async (address) => {
    const userRef = doc(db, "users", address);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserRole(data.role || "viewer");
    } else {
      setUserRole("viewer");
    }
  };

  // Admin: fetch all users from Firestore
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    const usersList = [];
    querySnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() });
    });

    setAllUsers(usersList);
    setLoadingUsers(false);
  };

  // Admin: update a user role
  const fetchEscrowData = async () => {
  if (!signer) return;

  try {
    const escrowContract = new ethers.Contract(CONTRACTS.Escrow.address, CONTRACTS.Escrow.abi, signer);
<Card>
  <CardContent>
    <h2 className="text-xl font-semibold mb-2">Escrow Info</h2>
    <p>Balance: {escrowBalance} ETH</p>
    <p>Arbiter: {arbiterAddress}</p>
    <p>Beneficiary: {beneficiaryAddress}</p>
    <p>Status: {isApproved ? "Approved" : "Pending"}</p>
    {/* You can add buttons here for admin actions later */}
  </CardContent>
</Card>
    // Assuming your contract has these functions, adjust if needed
    const balance = await signer.getBalance(CONTRACTS.Escrow.address);
    const arbiter = await escrowContract.arbiter();
    const beneficiary = await escrowContract.beneficiary();
    const approved = await escrowContract.isApproved();

    setEscrowBalance(ethers.utils.formatEther(balance));
    setArbiterAddress(arbiter);
    setBeneficiaryAddress(beneficiary);
    setIsApproved(approved);
  } catch (error) {
    console.error("Error fetching escrow data:", error);
  }
};
  const updateUserRole = async (address, newRole) => {
    const userRef = doc(db, "users", address);
    await updateDoc(userRef, { role: newRole });
    setAllUsers((prev) =>
      prev.map((user) =>
        user.id === address ? { ...user, role: newRole } : user
      )
    );
  };
useEffect(() => {
  if (signer) {
    fetchEscrowData();
  }
}, [signer]);
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        connectWallet();
      });
    }
  }, []);

  useEffect(() => {
    if (userRole === "admin") {
      fetchAllUsers();
    }
  }, [userRole]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">SE-STAR Smart Contract Dashboard</h1>

      {!connectedAddress ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div className="text-green-600 mb-4">
          Connected: {connectedAddress} ({userRole})
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CONTRACTS).map(([name, data]) => (
          <Card key={name}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{name}</h2>
              <p className="break-all text-sm text-gray-600">{data.address}</p>
              <Button className="mt-4" onClick={fetchEscrowArbiter}>
                Get Escrow Arbiter
              </Button>
             {escrowArbiter && (
             <p className="mt-2 text-sm text-gray-700 break-all">
              Arbiter: {escrowArbiter}
              </p>
               )}
             {userRole === "admin" && (
                <Button className="mt-2 bg-red-500 hover:bg-red-600">
                  Admin Action for {name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Only: User Role Management */}
      {userRole === "admin" && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">User Role Management</h2>

          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Wallet Address</th>
                  <th className="border border-gray-300 p-2">Role</th>
                  <th className="border border-gray-300 p-2">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(({ id, role }) => (
                  <tr key={id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 break-all">{id}</td>
                    <td className="border border-gray-300 p-2">{role}</td>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={role}
                        onChange={(e) => updateUserRole(id, e.target.value)}
                        className="border p-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}