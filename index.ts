import { generateText } from "./llm";
import {
  toneSystemPrompt,
  toneUserPrompt,
  userPrompt,
  writerSystemPrompt,
} from "./llm/prompt";
import { loadContext } from "./loader";
import { store } from "./loader/store";
import { saveResearch } from "./research";
import { saveToFile } from "./utils";

// --- Edit below this line ---
const title = "EventBridge Pipes: connecting everything you know together.";
const topic = "EventBridge Pipes";
const dirPath = "./blogs";
// --- Edit above this line ---

const research = await saveResearch(topic);

const draft = await generateText(
  userPrompt(title, research),
  writerSystemPrompt
);

// Load the context
await loadContext(dirPath);

// Retrieve the relevant documents
const retriever = store.asRetriever(6);
const docs = await retriever.getRelevantDocuments(title);
const toneContext = docs.map((doc) => doc.pageContent).join(" ");

const final = await generateText(
  toneUserPrompt(draft, toneContext),
  toneSystemPrompt
);

saveToFile("blog.md", final);

console.log("Blog saved as 'blog.md'.");
