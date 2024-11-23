"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(), // Array of text to embed
    fileId: v.string(), // File ID as metadata
  },
  handler: async (ctx, args) => {
    try {
      console.log("Ingesting text with metadata:", { splitText: args.splitText, fileId: args.fileId });
      const vectorStore = await ConvexVectorStore.fromTexts(
        args.splitText,
        { fileId: args.fileId }, // Ensure metadata is passed as an object
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyA2ufH32AXhEdAlruRU1flQcMFgIxe9oac",
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document Title",
        }),
        { ctx }
      );

      console.log("Embedding completed successfully:", vectorStore);
      return "Embedded Completed...";
    } catch (error) {
      console.error("Error during embedding:", error);
      throw new Error("Failed to embed texts.");
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Starting search action with args:", args);

      // Initialize vector store
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyA2ufH32AXhEdAlruRU1flQcMFgIxe9oac",
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document Title",
        }),
        { ctx }
      );

      // Perform similarity search
      const resultOne = await vectorStore.similaritySearch(args.query, 1);
      console.log("Similarity search results:", resultOne);

      if (!resultOne || resultOne.length === 0) {
        console.warn("No results found for the query.");
        return JSON.stringify([]);
      }

      // Check structure of metadata
      const filteredResults = resultOne.filter(
        (result) => result.metadata?.fileId === args.fileId
      );
      console.log("Filtered Results:", filteredResults);

      return JSON.stringify(filteredResults);
    } catch (error) {
      console.error("Error in search action:", error);
      throw new Error("Failed to process the search action.");
    }
  },
});
