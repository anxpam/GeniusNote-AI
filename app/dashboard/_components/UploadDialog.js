"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import axios from "axios";

const UploadDialog = ({ children, isMaxFile }) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.addFileEntryToDB);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddedDocument = useAction(api.myAction.ingest);
  const { user } = useUser(); // Retrieve user details from Clerk
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState("");
  const [open, setOpen] = useState(false);

  const onFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const onUpload = async () => {
    try {
      setLoading(true);

      // Step 1: Generate a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: Upload the file to the generated URL
      const uploadResult = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("File upload failed");
      }

      const { storageId } = await uploadResult.json();
      console.log("Storage ID:", storageId);

      // Step 3: Save file metadata to Convex database
      const fileId = uuid4(); // Generate a unique file ID
      const fileUrl = await getFileUrl({ storageId: storageId });
      const resultForFile = await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: filename || "Untitled File", // Use provided filename or fallback
        fileUrl: fileUrl,
        createdBy: user.primaryEmailAddress?.emailAddress,
      });
      console.log(resultForFile);

      //API CALL to fetch PDF Process DATA
      const apiResponse = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
      console.log(apiResponse.data.result);
      embeddedDocument({
        splitText: apiResponse.data.result,
        fileId: fileId,
      });
      //console.log(embeddedResult);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred during upload. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
      setFilename("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="w-full" disabled={isMaxFile}>
          Upload PDF File
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Upload Your PDF
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className="flex flex-col gap-4 mt-5">
                <Label htmlFor="pdf" className="text-sm font-medium">
                  Select PDF to Upload
                </Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={onFileSelect}
                  className="border border-gray-300 rounded-lg p-1"
                />
              </div>
              <div className="mt-4">
                <Label>File Name *</Label>
                <Input
                  placeholder="File Name"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="border border-gray-300 rounded-lg p-1"
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" 
            onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={onUpload} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
