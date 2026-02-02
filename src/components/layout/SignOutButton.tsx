"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-red-600 hover:text-red-800"
    >
      Sign Out
    </button>
  );
}
