import { TurbopufferVectorStore } from "@langchain/community/vectorstores/turbopuffer";
import { OpenAIEmbeddings } from "@langchain/openai";
import type { Document } from "langchain/document";

const embeddings = new OpenAIEmbeddings();

export const store = new TurbopufferVectorStore(embeddings, {
  apiKey: process.env.TURBOPUFFER_API_KEY,
  namespace: "allen-gpt",
});

export const upsertDocs = async (docs: Document<Record<string, any>>[]) => {
  await store.addDocuments(docs);
};
