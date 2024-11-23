import { NextResponse } from "next/server"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

//const pdfUrl = "https://dusty-duck-755.convex.cloud/api/storage/87f8b135-944c-4852-9156-4ded0d0f7e5d";

export const GET = async (req, res) => {

  const reqUrl = req.url;
  const {searchParams} = new URL(reqUrl);
  const pdfUrl = searchParams.get('pdfUrl');
  console.log(pdfUrl);
  //1. Load the PDF file
  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = "";
  docs.forEach(doc => {
    pdfTextContent = pdfTextContent + doc.pageContent;
  })

  //2. Split the Text into Small Chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const output = await splitter.createDocuments([pdfTextContent])

  //now in form of LIST
  let splitterList = [];
  output.forEach(doc => {
    splitterList.push(doc.pageContent);
  })
  return NextResponse.json({result: splitterList});
}