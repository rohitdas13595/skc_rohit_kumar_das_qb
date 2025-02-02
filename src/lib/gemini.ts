import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { settings } from "./settings/settings";

export class GeminiAgentService {
  private model: GenerativeModel;
  constructor() {
    const genAi = new GoogleGenerativeAI(settings.geminiApiKey);
    this.model = genAi.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  private readonly evaluationPrompt = `
      You are  a quiz  master who is  responsible for genrating quiz question in {language} programming language.
      Please generate a list of {numberOfQuestions} random {language} programming MCQ questions with 4 options  and  one correct answer for {level} level of difficulty.
      Answer should be part of the options.
     
      
      Provide result in the following format:
      {
        question: string,
        options: string [],
        answer: string
      }[]
  
      Return the response in pure  JSON string with the above format.
    `;

  async generateQuestions({
    language,
    numberOfQuestions,
    level,
  }: {
    language: string;
    numberOfQuestions: number;
    level: string;
  }): Promise<
    { question: string; options: string[]; answer: string }[] | null
  > {
    try {
      const prompt = this.evaluationPrompt
        .replace("{language}", language)
        .replace("{numberOfQuestions}", numberOfQuestions.toString())
        .replace("{level}", level);
      const generationConfig = {
        response_mime_type: "application/json", // Request JSON response
      };

      const result = await this.model.generateContent(prompt, {});
      const response = result.response;
      console.log("responseTest", response.text());

      const text = response.text();

      // Parse JSON from response
      const jsonMatch = cleanJsonString(text);
      const parsedResponse = jsonMatch ? JSON.parse(jsonMatch) : null;

      console.log("parsedResponse.......", parsedResponse);

      return parsedResponse;
    } catch (error) {
      console.log(
        error,
        "error.................................................................................................."
      );
      return null;
    }
  }
}
function cleanJsonString(str: string) {
  try {
    // Extract the JSON part between the first [ and last ]
    const match = str.match(/\[[\s\S]*\]/);
    if (match) {
      const jsonStr = match[0];
      // Validate that it's proper JSON
      JSON.parse(jsonStr); // This will throw if invalid
      return jsonStr;
    }
    throw new Error("No valid JSON array found");
  } catch (error) {
    console.error("Error processing JSON:", error);
    return null;
  }
}
