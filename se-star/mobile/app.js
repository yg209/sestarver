import React from 'react';
import AddressScanner from './components/AddressScanner';
import TrustWall from './components/TrustWall';
import RewardCenter from './components/RewardCenter';

function App() {
  return (
    <div className="app">
      <h1>SE-STAR Web Dashboard</h1>
      <AddressScanner />
      <TrustWall />
      <RewardCenter />
    </div>
  );
}

export default App;