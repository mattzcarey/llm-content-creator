import { getBlogFiles, splitDocs } from "./chunk";
import { upsertDocs } from "./store";

export const loadContext = async (dirPath: string): Promise<void> => {
  const blogs = getBlogFiles(dirPath);
  const docs = await splitDocs(blogs);
  await upsertDocs(docs);
};
