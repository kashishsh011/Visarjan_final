import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateWithFallback(prompt, inlineData) {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([prompt, { inlineData }]);
      return result.response.text();
    } catch (err) {
      const isRetryable = err.message?.includes('503') ||
        err.message?.includes('429') ||
        err.message?.includes('high demand') ||
        err.message?.includes('Service Unavailable') ||
        err.message?.includes('overloaded') ||
        err.message?.includes('quota') ||
        err.status === 429 || err.status === 503;

      if (!isRetryable || modelName === models[models.length - 1]) throw err;
      console.warn(`[Gemini] ${modelName} overloaded or quota hit, trying next model...`);
    }
  }
}

export async function analyzeIdolImage(base64Image, mimeType) {
  const prompt = `
    You are an expert in Indian religious idol materials and environmental impact.
    
    Analyze this image of a religious idol or pooja material and respond ONLY with a JSON object in this exact format:
    {
      "material": "PoP" | "Clay" | "Metal" | "Paper Pulp" | "Unknown",
      "confidence": "High" | "Medium" | "Low",
      "pollutionRisk": "High" | "Medium" | "Low",
      "recommendation": "one sentence on what to do with this",
      "dropPointType": "controlled_pond" | "clay_reuse" | "phool_partner" | "metal_recycler" | "general_ngo",
      "explanation": "2-3 sentences explaining why this material has this pollution risk"
    }
    
    Be specific about PoP (Plaster of Paris) vs natural clay — PoP is smooth, bright white/painted, 
    clay is rough, earthy brown. Only respond with the JSON, no other text.
  `;

  const text = await generateWithFallback(prompt, {
    mimeType,
    data: base64Image,
  });

  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}