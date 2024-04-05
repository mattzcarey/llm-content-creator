import { generateText } from "../ai";
import { researchSystemPrompt } from "../prompt";
import { saveToFile } from "../utils";
import { generateSubtopicReport } from "./subtopics";

export const saveResearch = async (researchTopic: string): Promise<string> => {
  console.log(`Researching topic: ${researchTopic}`);
  const subtopicChecklistPrompt = `Generate a detailed checklist of subtopics to research for the topic '${researchTopic}'. Return your checklist in a JavaScript-parseable array. Return nothing but the array. Do so in one line. Maximum five sub-topics. Start your response with ["`;

  const subtopicChecklist = JSON.parse(
    await generateText(subtopicChecklistPrompt, researchSystemPrompt)
  );

  console.log(`Subtopic Checklist: ${JSON.stringify(subtopicChecklist)}`);

  const subtopicReports: string[] = [];
  for (const subtopic of subtopicChecklist) {
    const subtopicReport = await generateSubtopicReport(subtopic);

    subtopicReports.push(subtopicReport);
  }

  const research = await generateComprehensiveReport(
    researchTopic,
    subtopicReports
  );

  await saveToFile("research.txt", research);
  console.log("Research saved as 'research.txt'.");

  return research;
};

const generateComprehensiveReport = async (
  topic: string,
  subtopicReports: string[]
): Promise<string> => {
  console.log("Generating comprehensive report...");

  const comprehensiveReportPrompt = `Generate a comprehensive report on the topic '${topic}' by combining the following reports on various subtopics:\n\n${subtopicReports.join(
    "\n\n"
  )}\n\n---\n\nEnsure that the final report is well-structured, coherent, and covers all the important aspects of the topic. Make sure that it includes EVERYTHING in each of the reports, in a better structured, more info-heavy manner. Nothing -- absolutely nothing, should be left out. If you forget to include ANYTHING from any of the previous reports, you will face the consequences. Include a table of contents. Leave nothing out. Use Markdown for formatting.`;
  const comprehensiveReport = await generateText(
    comprehensiveReportPrompt,
    researchSystemPrompt,
    "claude-3-opus-20240229",
    4000
  );

  console.log("Comprehensive report generated!");
  return comprehensiveReport;
};
