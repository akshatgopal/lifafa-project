/**
 * Helper functions for AI prompts and interaction with local Ollama instance.
 */

export const OLLAMA_BASE_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";

export async function queryOllama(model: string, prompt: string, stream = false) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    if (stream) {
      return response.body;
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error querying Ollama:", error);
    throw error;
  }
}

export const PROMPTS = {
  EXTRACT_GIFT_INFO: (text: string) => 
    `Extract the name of the person and the cash amount from the following text: "${text}". Format the output as JSON with keys "name" and "amount".`,
};
