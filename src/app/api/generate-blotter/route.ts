import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { complaint, customInstructions } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables");
      return NextResponse.json({ error: "No Gemini API key provided. Please check your .env.local file." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-2.5-flash as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert Barangay Secretary in the Philippines. 
      Your task is to convert an informal, often emotional citizen complaint into a structured, formal blotter report in Tagalog.
      
      Custom Instructions from the user:
      ${customInstructions || "None provided."}

      Citizen's Raw Narrative:
      "${complaint}"

      Please output a JSON object with the following structure:
      {
        "complainant": "Full name of the person complaining",
        "respondent": "Full name of the person being complained about",
        "natureOfComplaint": "Short title of the incident (e.g., Physical Injuries, Slander, Debt)",
        "formalSummary": "A detailed, professional narrative of the incident in Tagalog, removing emotional expletives and focusing on legal facts.",
        "incidentDate": "Date of incident if mentioned, otherwise 'Hindi nakasaad'",
        "incidentLocation": "Location of incident if mentioned, otherwise 'Hindi nakasaad'"
      }

      Only return the JSON object. No other text.
    `;

    console.log("Calling Gemini API with model: gemini-2.5-flash");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log("Received response from Gemini");

    // Clean the response in case Gemini adds markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Gemini API Error Detail:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      statusText: error.statusText
    });
    
    return NextResponse.json({ 
      error: error.message || "Failed to generate blotter",
      details: "Check server logs for more info" 
    }, { status: 500 });
  }
}
