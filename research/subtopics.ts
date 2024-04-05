import { generateText } from "../ai";
import { researchSystemPrompt } from "../prompt";
import { searchWeb } from "./web";

export const generateSubtopicReport = async (
  subtopic: string
): Promise<string> => {
  const searchData: any[] = [];
  const allQueries: string[] = [];

  console.log(`Generating initial search queries for subtopic: ${subtopic}...`);
  const initialQueriesPrompt = `Generate 3 search queries to gather information on the subtopic '${subtopic}'. Return your queries in a JavaScript-parseable array. Return nothing but the array. Do so in one line. Start your response with ["`;
  let initialQueries = JSON.parse(
    await generateText(initialQueriesPrompt, researchSystemPrompt)
  );
  console.log(initialQueries);
  allQueries.push(...initialQueries);

  for (let i = 0; i < 3; i++) {
    console.log(
      `Performing search round ${i + 1} for subtopic: ${subtopic}...`
    );
    for (const query of initialQueries) {
      const searchResults = await searchWeb(query);
      searchData.push(searchResults);
    }

    console.log(
      `Generating additional search queries for subtopic: ${subtopic}...`
    );
    const additionalQueriesPrompt = `Here are the search results so far for the subtopic '${subtopic}':\n\n${JSON.stringify(
      searchData
    )}\n\n---\n\nHere are all the search queries you have used so far for this subtopic:\n\n${JSON.stringify(
      allQueries
    )}\n\n---\n\nBased on the search results and previous queries, generate 3 new and unique search queries to expand the knowledge on the subtopic '${subtopic}'. Return your queries in a JavaScript-parseable array. Return nothing but the array. Do so in one line. Start your response with ["`;
    const additionalQueries = JSON.parse(
      await generateText(additionalQueriesPrompt, researchSystemPrompt)
    );

    initialQueries = additionalQueries;
    allQueries.push(...additionalQueries);
  }

  console.log(`Generating initial report for subtopic: ${subtopic}...`);
  const reportPrompt = `When writing your report, make it incredibly detailed, thorough, specific, and well-structured. Use Markdown for formatting. Analyze the following search data and generate a comprehensive report on the subtopic '${subtopic}':\n\n${JSON.stringify(
    searchData
  )}`;
  let report = await generateText(
    reportPrompt,
    researchSystemPrompt,
    "claude-3-haiku-20240307",
    3000
  );

  for (let i = 0; i < 3; i++) {
    console.log(
      `Analyzing report and generating additional searches (Round ${
        i + 1
      }) for subtopic: ${subtopic}...`
    );
    const analysisPrompt = `Analyze the following report on the subtopic '${subtopic}' and identify areas that need more detail or further information:\n\n${report}\n\n---\n\nHere are all the search queries you have used so far for this subtopic:\n\n${JSON.stringify(
      allQueries
    )}\n\n---\n\nGenerate 3 new and unique search queries to fill in the gaps and provide more detail on the identified areas. Return your queries in a JavaScript-parseable array. Return nothing but the array. Do so in one line. Start your response with ["`;
    const additionalQueries = JSON.parse(
      await generateText(analysisPrompt, researchSystemPrompt)
    );

    allQueries.push(...additionalQueries);

    const roundSearchData: any[] = [];
    for (const query of additionalQueries) {
      const searchResults = await searchWeb(query);
      roundSearchData.push(searchResults);
    }

    console.log(
      `Updating report with additional information (Round ${
        i + 1
      }) for subtopic: ${subtopic}...`
    );
    const updatePrompt = `Update the following report on the subtopic '${subtopic}' by incorporating the new information from the additional searches. Keep all existing information... only add new information:\n\n${report}\n\n---\n\nAdditional search data for this round:\n\n${JSON.stringify(
      roundSearchData
    )}\n\n---\n\nGenerate an updated report that includes the new information and provides more detail in the identified areas. Use Markdown for formatting.`;
    report = await generateText(
      updatePrompt,
      researchSystemPrompt,
      "claude-3-opus-20240229",
      4000
    );
  }

  console.log(`Generating boss feedback for subtopic: ${subtopic}...`);
  const feedbackPrompt = `Imagine you are the boss reviewing the following report on the subtopic '${subtopic}':\n\n${report}\n\n---\n\nProvide constructive feedback on what information is missing or needs further elaboration in the report. Be specific and detailed in your feedback.`;
  const feedback = await generateText(
    feedbackPrompt,
    researchSystemPrompt,
    "claude-3-opus-20240229",
    1000
  );

  console.log(
    `Generating final round of searches based on feedback for subtopic: ${subtopic}...`
  );
  const finalQueriesPrompt = `Based on the following feedback from the boss regarding the subtopic '${subtopic}':\n\n${feedback}\n\n---\n\nGenerate 3 search queries to find the missing information and address the areas that need further elaboration. Return your queries in a JavaScript-parseable array. Return nothing but the array. Do so in one line. Start your response with ["`;
  const finalQueries = JSON.parse(
    await generateText(finalQueriesPrompt, researchSystemPrompt)
  );

  allQueries.push(...finalQueries);

  const finalSearchData: any[] = [];
  for (const query of finalQueries) {
    const searchResults = await searchWeb(query);
    finalSearchData.push(searchResults);
  }

  console.log(
    `Updating report with final information for subtopic: ${subtopic}...`
  );
  const finalUpdatePrompt = `Update the following report on the subtopic '${subtopic}' by incorporating the new information from the final round of searches based on the boss's feedback:\n\n${report}\n\n---\n\nFinal search data:\n\n${JSON.stringify(
    finalSearchData
  )}\n\n---\n\nGenerate the final report that addresses the boss's feedback and includes the missing information. Use Markdown for formatting.`;
  const finalReport = await generateText(
    finalUpdatePrompt,
    researchSystemPrompt,
    "claude-3-opus-20240229",
    4000
  );

  console.log(`Final report generated for subtopic: ${subtopic}!`);
  return finalReport;
};
