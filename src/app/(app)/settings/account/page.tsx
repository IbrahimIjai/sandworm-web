"use client";

import { ConnectWallet } from "@/components/AuthUI/ConnectWallet";
import { useState } from "react";

export default function AccountSettings() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setLoading(false);
  };

  return (
    <div>
      <div className="border-b">
        <h2 className="text-xl font-medium text-white mb-2 ">Link Wallet</h2>
      </div>

      <div>
        <p className="text-sm mt-3 max-w-[45rem]">
          Linking your wallet isn’t required, but it may be essential for
          claiming rewards or proving on-chain ownership of your contributions
          in the future
        </p>
        <ConnectWallet />
      </div>

      <div className="border-b mt-12">
        <h2
          className="text-xl font-medium  mb-2 
        text-orange-600"
        >
          Delete Account
        </h2>
      </div>

      <div>
        <p className="text-sm mt-3 max-w-[45rem]">
          This will permanently delete your Sandworm account, including your
          saved queries and workspace data. This action cannot be undone.
        </p>
        <button
          type="button"
          className="mt-4 flex  items-center justify-center space-x-2 rounded-md border border-white/20 bg-white/10 px-4 py-1.5 text-orange-600 hover:bg-white/15 text-sm  "
        >
          <span>Delete your account</span>
        </button>
      </div>
    </div>
  );
}
