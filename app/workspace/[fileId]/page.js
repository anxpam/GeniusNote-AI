"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PDFViewer from "../_components/PDFViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextEditor from "../_components/TextEditor";
import { Loader2Icon } from "lucide-react";

const Workspace = () => {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.getFileRecord, {
    fileId,
  });

  useEffect(() => {
    console.log("File Info: ", fileInfo);
  }, [fileInfo]);

  if (!fileInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin w-20 h-20" />
      </div>
    );
  }

  if (!fileInfo.fileUrl) {
    return <div className="flex justify-center items-center h-screen">File URL is not available</div>;
  }

  return (
    <>
      <WorkspaceHeader fileName={fileInfo?.fileName}/>
      <div className="grid grid-cols-2 gap-5">
        <div>
          {/* Text Editior*/}
          <TextEditor fileId={fileId}/>
        </div>

        <div>
          {/* PDF Viewwe*/}
          <PDFViewer fileUrl={fileInfo.fileUrl} />
        </div>
      </div>
    </>
  );
};

export default Workspace;
