// SE-STAR React Web3 App - Starter Code (Enterprise Ready)

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { FirebaseAuth } from "@/components/auth/FirebaseAuth";
import { TrustBadge } from "@/components/exchange/TrustBadge";
import { SuspiciousWalletMonitor } from "@/components/monitor/WalletMonitor";
import { EscrowVault } from "@/components/escrow/EscrowVault";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const registerUser = async (address, role) => {
  const userRef = doc(db, "users", address);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      address,
      role,
      createdAt: new Date().toISOString()
    });
    console.log("👤 User registered:", address);
  }
};
export default function SEStarApp() {
  return (
    
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid gap-6">
        <h1 className="text-4xl font-bold text-center">SE-STAR Web3 Security Portal</h1>

        <Card className="bg-white shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <WalletConnectButton />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Login with 2FA</h2>
            <FirebaseAuth />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Trust Badge</h2>
            <TrustBadge />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Live Wallet Monitoring</h2>
            <SuspiciousWalletMonitor />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Escrow & Custody Vault</h2>
            <EscrowVault />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}