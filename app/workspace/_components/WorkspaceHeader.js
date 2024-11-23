
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";


const WorkspaceHeader = ({ fileName }) => {
  return (
    <>
      <div className="p-4 flex items-center shadow-md">
        {/* Logo */}
        <Image src={"/logo.png"} alt="logo" width={140} height={100} />

        {/* File Name */}
        <p className="text-2xl font-bold flex-grow text-center">{fileName}</p>


        {/* User Button */}
        <UserButton />
      </div>
    </>
  );
};

export default WorkspaceHeader;
