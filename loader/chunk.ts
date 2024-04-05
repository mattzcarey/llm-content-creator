import { readFileSync, readdirSync } from "fs";
import type { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { join } from "path";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 1,
  separators: ["##", "\n", "."],
});

export const getBlogFiles = (blogDirectory: string): Document[] => {
  const blogDocs: Document[] = [];

  // Read all files in the blog directory
  const files = readdirSync(blogDirectory);

  for (const file of files) {
    const filePath = join(blogDirectory, file);
    const fileContents = readFileSync(filePath, "utf-8");

    blogDocs.push({
      pageContent: fileContents,
      metadata: {
        fileName: file,
      },
    });
  }

  return blogDocs;
};

export const splitDocs = async (
  docs: Document[]
): Promise<Document<Record<string, any>>[]> => {
  return await splitter.splitDocuments(docs);
};
