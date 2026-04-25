## Product Requirements Document (PRD): Lupon-Bot v2.0
# 1. Problem Statement
Barangay administrative staff spend a disproportionate amount of their day mediating local disputes and translating highly emotional, unstructured citizen complaints into formal Katarungang Pambarangay (KP) blotter reports. While AI can automate this translation, different barangays often have slight variations in their preferred administrative phrasing, document headers, or specific KP Form formats. A rigid, one-size-fits-all output does not accommodate the localized needs of different municipal jurisdictions.

# 2. Product Goal
To provide a hyper-local, AI-driven web application that instantly converts informal citizen narratives into legally formatted, ready-to-print DOCX KP forms. By utilizing local template management, users can customize the AI's output instructions (prompts) and format the final document to strictly adhere to their specific barangay's standards without needing a complex account system.

# 3. Core Features
Custom Template Manager: A dashboard where users can define their barangay's specific document headers (e.g., specific City/Province names) and inject custom instructions into the AI prompt (e.g., "Always use the term 'Punong Barangay' instead of 'Chairman'"). Data is persisted locally in the browser.

Unstructured Narrative Input Engine: A simple, distraction-free text interface designed to accept messy, slang-filled, or emotionally charged multi-paragraph complaints.

Contextual Fact Extraction (AI Module): An AI processing layer that scans the raw input to isolate key data points (complainant, respondent, nature of complaint) while filtering out emotional expletives.

Direct-to-DOCX Generator: A client-side export mechanism that maps the extracted AI data and the user's saved template preferences directly into a standard, printable Word Document.

# 4. User Stories
As a Barangay Secretary, I want to save our specific provincial and city headers in a template profile, so that I don't have to retype them every time I generate a new KP form.

As a Lupon Tagapamayapa mediator, I want to tweak the AI instructions to match our specific local dialect or legal formatting preferences, so the output feels authentic to our local government unit.

As an administrative clerk, I want to paste a citizen's chaotic complaint into a text box and click one button to download a customized DOCX, so that I save hours of manual typing and formatting.