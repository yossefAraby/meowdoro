import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface ContextData {
  timerMode?: string;
  notes?: string[];
  tasks?: string[];
  messageHistory?: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private readonly CAT_COMPANION_CONTEXT = `You are a friendly and helpful cat study companion named Meowdoro. You have a playful personality but are also focused on helping with productivity and learning. 
You should:
- Use cat-like expressions and sometimes add "meow" or "purr" to your responses
- Be encouraging and supportive
- Give practical advice about studying and productivity
- Keep responses concise and engaging
- Maintain a balance between being playful and helpful
- Use emojis sometimes to express emotions (especially cat emojis 😺)`;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    // Remove any whitespace from the API key
    const cleanApiKey = apiKey.trim();
    
    if (!this.validateApiKey(cleanApiKey)) {
      throw new Error("Invalid API key format");
    }

    try {
      // Initialize with the correct API version
      this.genAI = new GoogleGenerativeAI(cleanApiKey);
      
      // Use gemini-2.0-flash model as shown in the example
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
    } catch (error) {
      console.error("Error initializing Gemini:", error);
      throw new Error("Failed to initialize Gemini API. Please check your API key.");
    }
  }

  async generateResponse(prompt: string, context?: ContextData): Promise<string> {
    try {
      if (!this.model) {
        throw new Error("Model not initialized");
      }

      let fullPrompt = this.CAT_COMPANION_CONTEXT + "\n\n";

      if (context?.messageHistory) {
        fullPrompt += "Previous conversation:\n" + context.messageHistory + "\n\n";
      }

      if (context?.timerMode) {
        fullPrompt += `Current timer mode: ${context.timerMode}\n`;
      }

      if (context?.notes && context.notes.length > 0) {
        fullPrompt += "Recent notes:\n" + context.notes.map(note => `- ${note}`).join("\n") + "\n";
      }

      if (context?.tasks && context.tasks.length > 0) {
        fullPrompt += "Current tasks:\n" + context.tasks.map(task => `- ${task}`).join("\n") + "\n";
      }

      fullPrompt += "\nUser message: " + prompt;

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      if (error instanceof Error) {
        throw new Error(`AI response error: ${error.message}`);
      }
      throw new Error("Failed to generate response");
    }
  }

  validateApiKey(apiKey: string): boolean {
    // Updated validation for the new API key format
    return apiKey.length > 0 && apiKey.startsWith("AIza");
  }
} 