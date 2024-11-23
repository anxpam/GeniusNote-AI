import React, { useEffect } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import {StarterKit,  BulletList, 
  OrderedList, 
  ListItem } from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import EditorExtension from './EditorExtension';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const TextEditor = ({fileId}) => {
  
  //here we are getting saving notes from DB when we refresh the page
  const notes = useQuery(api.notes.getNotes, {
    fileId: fileId
  });
  //console.log(notes);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Explicitly configure list extensions
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your notes...",
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
      },
    },
  });

  //show saved notes on again editor, after refresh
  useEffect(() => {
    //editor should be initialize
    editor && editor.commands.setContent(notes);
  },[editor && notes]);
  
  return (
    <>
      <EditorExtension editor={editor} />
      <div className="overflow-scroll h-[88vh]">
      <EditorContent editor={editor} />
      </div>
      
    </>
  );
};

export default TextEditor;