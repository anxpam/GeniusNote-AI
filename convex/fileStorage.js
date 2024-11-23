import {mutation} from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});


export const addFileEntryToDB = mutation({
  args: {
    fileId : v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl : v.string(),
    createdBy: v.string()
  },

  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileUrl : args.fileUrl,
      createdBy: args.createdBy
    });
    return "PDF inserted";
  },
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string()
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  }
});

export const getFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .first(); // Use `.first()` to directly get the first matching document
    console.log(result);
    return result || null; // Return null if no record is found
  },
});

//for getting all the files, to show on workspace
export const getUserFiles = query({
  args: {
    userEmail: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('pdfFiles')
    .filter((q) => q.eq(q.field('createdBy'), args?.userEmail)).collect();

    return result;
  }
})