# 📄 AI Document Analyzer (RAG System)

A full-stack Retrieval-Augmented Generation (RAG) web application that allows users to upload PDF documents and ask contextual questions, powered by Node.js, Express, and Google Gemini AI.

## ✨ About the Project & Implementation

* **Architecture:** Built as a modern client-server application featuring an Express backend and a clean, minimalist frontend.
* **Backend Processing:** Utilizes `multer` for in-memory file handling and `pdf-extraction` to parse and extract raw text from uploaded PDF documents seamlessly on Node.js v22.
* **AI Integration:** Implements strict prompt engineering constraints via the `@google/generative-ai` SDK (Gemini), forcing the model to answer user queries **strictly** based on the provided document context to prevent hallucinations.
* **Deployment Ready:** Fully containerized using Docker for consistent and reliable deployment across any environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be open and running)
* A valid Google Gemini API Key

### Environment Variables Setup

Create a `.env` file in the root directory of the project (`rag-project`) and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```
*(Note: Do not use quotation marks around your API key).*

## 🚀 Running the Application (Docker)

1. **Start Docker Desktop:** Ensure the Docker daemon is running in the background.

2. **Navigate to the Project Directory:**
   ```bash
   cd rag-project
   ```

3. **Build the Docker Image:**
   ```bash
   docker build -t ai-doc-analyzer .
   ```

4. **Start the Container:**
   ```bash
   docker run -d -p 3000:3000 --env-file .env ai-doc-analyzer
   ```

5. **Access the Application:**
   Open your web browser and navigate to:
   [http://localhost:3000](http://localhost:3000)
