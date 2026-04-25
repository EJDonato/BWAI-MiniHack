### System Architecture: Lupon-Bot
## 1. High-Level Overview
Lupon-Bot utilizes a modern, serverless architecture. The application is built on the Next.js framework (App Router) to handle both the React frontend and server-side API routes. Firebase handles user identity and data persistence, while the Google Gemini API serves as the core NLP engine.

## 2. Technology Stack
Frontend: Next.js (React), Tailwind CSS, TypeScript

Backend / API: Next.js Route Handlers (Serverless Functions)

AI Provider: Google Gemini API (gemini-2.5-flash)

Document Generation: docx (NPM package)

## 3. Architecture Components
# A. Client Layer (Next.js Frontend)
Dashboard / Settings: Interfaces for users to update their Barangay Profile (Headers, custom AI instructions) stored in LocalStorage.

Generator Interface: The main input field for the messy complaints.

DOCX Engine: The docx library runs entirely on the client side. It takes the structured JSON returned by the AI and the user's template data to construct and download the .docx file in the browser.

# B. Server Layer (Next.js API Routes)
/api/generate-blotter: A secure serverless route.

Receives the raw citizen complaint and custom instructions.

Securely calls the Gemini API (protecting the API key from the client).

Returns a strictly formatted JSON object containing the extracted legal facts and formal summary.

## 4. System Data Flow
Initialization: The user navigates to the app.

Template Configuration (Optional): The user saves their barangay details and custom AI rules to LocalStorage.

Input: The user pastes a messy narrative into the Next.js client interface and submits.

Processing Request: The Next.js client sends a POST request to the /api/generate-blotter route, including the custom instructions from local state.

AI Execution: The API route constructs a prompt combining the user's instructions with the raw narrative and sends it to the Gemini API.

Structured Response: Gemini returns a structured JSON payload.

Document Assembly: The Next.js client receives the JSON, feeds it into the docx library, and triggers a native browser download.