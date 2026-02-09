import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateEmailResponse(
    prompt: string,
    model = "llama3-70b-8192"
): Promise<string | null> {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful email assistant.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: model,
            temperature: 0.5,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || null;
    } catch (error) {
        console.error("Groq API Error:", error);
        return null;
    }
}

export async function classifyEmail(
    subject: string,
    body: string
): Promise<{ category: string; confidence: number; reasoning: string } | null> {
    try {
        const prompt = `
      Analyze the following email and classify it into one of these categories:
      - LEAD (Inquiry about price, custom/bespoke work, design request)
      - ORDER (Standard order, contains shipping/billing details)
      - SPAM (Marketing, unsolicited)
      - OTHER (Everything else)

      email_subject: "${subject}"
      email_body: "${body.substring(0, 5000)}"

      Return ONLY a JSON object: { "category": "LEAD" | "ORDER" | "SPAM" | "OTHER", "confidence": number (0-1), "reasoning": "brief explanation" }
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an email classification engine. Output JSON only.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-70b-8192",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return null;

        return JSON.parse(content);
    } catch (error) {
        console.error("Groq Classification Error:", error);
        return null;
    }
}
