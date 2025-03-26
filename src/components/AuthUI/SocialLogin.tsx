"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useTransition } from "react";

export default function SocialLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = async () => {
    startTransition(async () => {
      await signIn("google");
    });
  };

  const handleGithubSignIn = async () => {
    startTransition(async () => {
      await signIn("github");
    });
  };

  return (
    <div className="mt-6 flex space-x-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-1/2 items-center justify-center space-x-2 rounded-md border border-[#ffffff50]  px-4 py-2 text-white hover:bg-gray-600"
      >
        <FcGoogle size={20} />
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={handleGithubSignIn}
        className="flex w-1/2 items-center justify-center space-x-2 rounded-md border border-[#ffffff50]  px-4 py-2 text-white hover:bg-gray-600"
      >
        <FaGithub size={20} />
        <span>GitHub</span>
      </button>
    </div>
  );
}
