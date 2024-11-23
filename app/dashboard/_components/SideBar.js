"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Layout, Shield } from "lucide-react";
import Image from "next/image";
import React from "react";
import UploadDialog from "./UploadDialog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress.emailAddress,
  });
  const path = usePathname();

  //getting user info from user.js
  const getUserInfo = useQuery(api.user.getUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });
  console.log(getUserInfo);

  return (
    <div className="h-full p-4 bg-gray-100 shadow-md flex flex-col">
    {/* Logo */}
    <Image src={"/logo.png"} alt="logo" width={160} height={110} />
  
    {/* Menu Items */}
    <div className="mt-20 flex-grow">
      <UploadDialog
        isMaxFile={fileList?.length >= 5 && !getUserInfo?.upgrade ? true : false}
      >
        <Button className="w-full bg-black text-white hover:bg-gray-900">
          Upload PDF File
        </Button>
      </UploadDialog>
  
      <Link href={"/dashboard"}>
        <div
          className={`flex gap-3 items-center p-3 mt-5 hover:bg-slate-300 rounded-lg cursor-pointer ${
            path === "/dashboard" && "bg-slate-300"
          }`}
        >
          <Layout />
          <h3 className="text-black font-semibold">Dashboard</h3>
        </div>
      </Link>
  
      <Link href={"/dashboard/upgrade"}>
        <div
          className={`flex gap-3 items-center p-3 mt-4 hover:bg-slate-300 rounded-lg cursor-pointer ${
            path === "/dashboard/upgrade" && "bg-slate-300"
          }`}
        >
          <Shield />
          <h3 className="text-black font-semibold">Upgrade</h3>
        </div>
      </Link>
    </div>
  
    {/* Footer */}
    {!getUserInfo?.upgrade && (
      <div className="mt-auto bg-white p-4 rounded-lg shadow-md mb-10">
        <Progress value={(fileList?.length / 5) * 100} className="mb-2" />
        <p className="text-sm text-gray-600">{fileList?.length} out of 5 PDFs Uploaded</p>
        <p className="text-sm text-gray-400 mt-1">Upgrade to Upload more</p>
      </div>
    )}
  </div>
  );
};

export default SideBar;
