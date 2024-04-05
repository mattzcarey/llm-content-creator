import Anthropic from "@anthropic-ai/sdk";
import retry from "async-retry";

const anthropic = new Anthropic();

const removeFirstLine = (testString: string): string => {
  if (
    testString.startsWith("Here") &&
    testString.split("\n")[0].trim().endsWith(":")
  ) {
    return testString.replace(/^.*\n/, "");
  }
  return testString;
};

export const generateText = async (
  prompt: string,
  systemPrompt: string,
  model = "claude-3-haiku-20240307",
  maxTokens = 2000,
  temperature = 0.7
): Promise<string> => {
  return await retry(async (bail, attempt) => {
    console.log(`Attempt ${attempt} to generate text...`);

    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      });
      const responseText = response.content[0].text;
      console.log(removeFirstLine(responseText.trim()));
      return removeFirstLine(responseText.trim());
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate text.");
    }
  });
};
