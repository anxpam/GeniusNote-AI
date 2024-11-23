"use client";
import { chatSession } from "@/app/configs/AIModel";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Strikethrough,
  Highlighter,
  List, // Bullet List
  ListOrdered, // Numbered List
  Sparkles,
  Loader2Icon,
} from "lucide-react";
import { useParams } from "next/navigation";

import React, { useState } from "react";
import { toast } from "sonner";

const EditorExtension = ({ editor }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { fileId } = useParams();
  const searchAI = useAction(api.myAction.search);

  //calling addNotes from notes.js convex
  const saveNotes = useMutation(api.notes.addNotes);
  const { user } = useUser();

  const onAIButtonClick = async () => {
    toast("Working on your answer...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );
    //console.log("selectedText",selectedText);
    const result = await searchAI({
      query: selectedText,
      fileId: fileId,
    });
    const unformattedAns = JSON.parse(result);
    let allUnformattedAnswer = "";
    unformattedAns &&
      unformattedAns.forEach((item) => {
        allUnformattedAnswer += item.pageContent;
      });

    const PROMPT = `
      For the question: "${selectedText}" and with the given content as the answer, 
      please format the response appropriately in valid and semantic HTML. The answer content is: ${allUnformattedAnswer}
      `;

    // Call AI Model
    const aiModelResult = await chatSession.sendMessage(PROMPT);

    // Extract and format the AI response
    let finalAnswer = aiModelResult.response.text();

    // Clean up and ensure proper HTML formatting
    finalAnswer = finalAnswer
      .replace("```", "")
      .replace("html", "")
      .replace("```", "");

    // Append the formatted answer to the editor content
    const currentContent = editor.getHTML();
    editor.commands.setContent(
      `${currentContent}
          <p><strong>Answer:</strong></p>
          ${finalAnswer}`
    );

    //save notes, this is for autmoatic save for AI ans
    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress.emailAddress,
    });
    //console.log("Unformated ans: ", result);
  };

  //function for saving the notes by clicking on save button
  const handleSave = async () => {
    setIsSaving(true);
    try{
      toast("Saving your notes...");
      await saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress.emailAddress
      });
      toast.success("Notes saved successfully");
    }catch(err){
      console.log("Error while saving notes: ", err);
      toast.error("Failed!. Please Try again");
    }finally{
      setIsSaving(false);
    }
  }

  return (
    editor && (
      <div className="p-4">
        <div className="control-group">
          <div className="button-group flex gap-2">
            {/* Heading Buttons */}
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""
              }
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "text-blue-500" : ""
              }
            >
              H3
            </button>

            {/* Text Formatting Buttons */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "text-blue-500" : ""}
            >
              <Bold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "text-blue-500" : ""}
            >
              <Italic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "text-blue-500" : ""}
            >
              <UnderlineIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "text-blue-500" : ""}
            >
              <Strikethrough />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive("highlight") ? "text-blue-500" : ""}
            >
              <Highlighter />
            </button>

            {/* Text Alignment Buttons */}
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""
              }
            >
              <AlignLeft />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""
              }
            >
              <AlignCenter />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""
              }
            >
              <AlignRight />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={
                editor.isActive({ textAlign: "justify" }) ? "text-blue-500" : ""
              }
            >
              <AlignJustify />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "text-blue-500" : ""}
            >
              <List />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "text-blue-500" : ""}
            >
              <ListOrdered />
            </button>

            {/* AI BUTTON*/}

            <button
              onClick={() => onAIButtonClick()}
              className={"hover:text-blue-500"}
            >
              <Sparkles />
            </button>
            {/* Save Button */}
            <Button className="ml-auto mr-4"
            onClick={handleSave} disabled={isSaving}
            >{isSaving ? <Loader2Icon /> : "Save"}</Button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditorExtension;
