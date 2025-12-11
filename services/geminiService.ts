import { GoogleGenAI } from "@google/genai";
import { Property } from "../types";

// Helper to get AI instance safely
const getAI = () => {
    // In a real app, strict env check. For demo, we assume existence or handle error.
    const apiKey = process.env.API_KEY || ''; 
    return new GoogleGenAI({ apiKey });
};

export const generatePropertyInsight = async (
    property: Property, 
    userQuery: string,
    history: {role: 'user' | 'model', text: string}[]
): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return "Demo Mode: Configure API_KEY in environment to chat with the real AI. This property is verified and excellent for investment.";
        }

        const ai = getAI();
        
        // Contextual System Instruction
        const systemInstruction = `
            You are "Homeward Guide", an expert AI real estate consultant for the "Homeward Plots" platform.
            Your audience is Non-Resident Indians (NRIs) looking to buy land in India.
            
            Current Property Context:
            Title: ${property.title}
            Location: ${property.location.city}, ${property.location.state}
            Price: ₹${property.price.inr.toLocaleString()} ($${property.price.usd.toLocaleString()})
            Area: ${property.specs.area} sq ft
            Verification Level: ${property.verificationLevel}
            Documents Verified: ${property.documents.filter(d => d.verified).map(d => d.name).join(', ')}
            Missing/Pending Documents: ${property.documents.filter(d => !d.verified).map(d => d.name).join(', ')}

            Your Goal:
            1. Build trust. Be professional, cautious, and transparent.
            2. Explain Indian legal terms (like Khata, Patta, EC) simply if asked.
            3. Highlight the specific verified status of THIS property.
            4. If a critical document is missing (like the NOC in the context), warn the user gently but clearly.
            5. Keep answers concise (under 150 words) unless detailed analysis is requested.

            Do not invent facts. If you don't know, suggest they use the "Request Legal Opinion" service ($350).
        `;

        const model = 'gemini-2.5-flash';

        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: systemInstruction,
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({
            message: userQuery
        });

        return result.text || "I couldn't generate a response at this time.";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting to the Homeward secure server right now. Please try again later.";
    }
};

export const generateInvestmentReport = async (property: Property): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return `# Demo Investment Report
**Note:** Configure API_KEY to generate real AI analysis.

## ROI Potential
Based on historical data, this property in ${property.location.district} shows a strong upward trend.

## Location Analysis
Located in a developing corridor of ${property.location.city}.

## Risk Factors
- Check specifically for: ${property.documents.find(d => !d.verified)?.name || "Future road widening plans"}
- Verification Level: ${property.verificationLevel} (High security)`;
        }

        const ai = getAI();
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Generate a structured investment analysis report for a land property with the following details:
            Title: ${property.title}
            City: ${property.location.city}, State: ${property.location.state}
            Current Price: ₹${property.price.inr} ($${property.price.usd})
            Price per SqFt: ₹${property.price.pricePerSqFt}
            Area: ${property.specs.area} sq ft
            Price History (Year: Price/sqft): ${JSON.stringify(property.priceHistory)}
            Verification Level: ${property.verificationLevel}

            Please output the report in Markdown format with the following sections:
            1. **Executive Summary**: A 2-sentence overview.
            2. **ROI Analysis**: Calculate the approximate CAGR based on the price history provided.
            3. **Location Potential**: Analyze the potential of ${property.location.district}, ${property.location.city} based on general real estate knowledge.
            4. **Risk Assessment**: Based on the fact that this is a ${property.verificationLevel} verified property.
            
            Tone: Professional, analytical, and cautious (trust-building).
        `;

        const result = await ai.models.generateContent({
            model: model,
            contents: prompt
        });

        return result.text || "Report generation failed.";
    } catch (error) {
        console.error("Gemini Report Error:", error);
        return "Unable to generate report at this time. Please try again later.";
    }
};