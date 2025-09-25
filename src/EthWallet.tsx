import { useState } from "react";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const EthWallet = () => {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [amount, setAmount] = useState<string>("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        const bal = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(bal, "ether"));
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const sendTransaction = async () => {
    if (!account || !amount) return alert("Enter amount & connect wallet first");

    const web3 = new Web3(window.ethereum);
    try {
      await web3.eth.sendTransaction({
        from: account,
        to: account, // self-send for testing
        value: web3.utils.toWei(amount, "ether"),
      });
      alert("Transaction sent!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold mb-4">ETH Wallet</h1>
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-6">
          <p><strong>Account:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>

          {/* ✅ SEND Section */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={sendTransaction}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Send ETH
            </button>
          </div>

          {/* ✅ RECEIVE Section */}
          <div className="mt-6 p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Receive ETH</h2>
            <p className="text-sm break-all">{account}</p>
            <div className="flex justify-center mt-4">
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              Share this address (or QR code) to receive ETH.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EthWallet;
