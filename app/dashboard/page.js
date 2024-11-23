"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress.emailAddress,
  });

  console.log(fileList);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Outer Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Workspace Header */}
        <h2 className="font-semibold text-3xl mb-6 text-gray-800">
          Workspace
        </h2>

        {/* Files Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {fileList?.length > 0
            ? fileList.map((file, index) => (
                <Link
                  href={"/workspace/" + file.fileId}
                  key={file.fileId || index}
                >
                  <div className="flex flex-col items-center justify-center p-5 shadow-md rounded-lg border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-transform transform hover:scale-105 bg-white">
                    <Image
                      src={"/pdf.png"}
                      alt="file"
                      width={60}
                      height={60}
                      className="mb-3"
                    />
                    <h3 className="font-medium text-lg text-gray-700 text-center">
                      {file?.fileName || "Unnamed File"}
                    </h3>
                  </div>
                </Link>
              ))
            : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                <div
                  key={index}
                  className="h-[150px] bg-slate-300 rounded-md animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
