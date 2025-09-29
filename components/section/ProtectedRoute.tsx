"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const githubToken = localStorage.getItem("github_token");
    const vercelToken = localStorage.getItem("vercel_token");

    if (!githubToken || !vercelToken) {
      router.replace("/"); // redirect to home
    }
  }, [router]);

  return <>{children}</>; // render children if tokens exist
};

export default ProtectedRoute;
