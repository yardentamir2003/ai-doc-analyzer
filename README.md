# 📄 AI Document Analyzer (RAG System)

A full-stack Retrieval-Augmented Generation (RAG) web application that allows users to upload PDF documents and ask contextual questions, powered by Node.js, Express, and Google Gemini AI.

## About the Project & Implementation
* **Architecture:** Built as a modern client-server application featuring an Express backend and a clean, minimalist frontend.
* **Backend Processing:** Utilizes `multer` for in-memory file handling and `pdf-extraction` to parse and extract raw text from uploaded PDF documents seamlessly on Node.js v22.
* **AI Integration:** Implements strict prompt engineering constraints via the `@google/generative-ai` SDK (Gemini), forcing the model to answer user queries **strictly** based on the provided document context.


Running the Application:
0. open Docker Desktop

1. change directory to project:
cd rag-project

2. start the docker container:
docker run -d -p 3000:3000 --env-file .env ai-doc-analyzer

3. Access the application:
Open your web browser and navigate to http://localhost:3000
