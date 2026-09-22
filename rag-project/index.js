require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const app = express();
app.use(express.json());

// API Initialize model with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Choose model
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

// Endpoint gets question from user and returns answer from model
app.post('/api/ask', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        if (!userPrompt) {
            return res.status(400).json({ error: 'Please provide a prompt' });
        }

        // Send prompt to model
        const result = await model.generateContent(userPrompt);
        const responseText = result.response.text();

        res.json({ success: true, answer: responseText });
    } catch (error) {
        console.error('Error with AI model:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// New endpoint
app.post('/api/rag', async (req, res) => {
    try {
        const userQuestion = req.body.question;
        if (!userQuestion) {
            return res.status(400).json({ error: 'Please provide a question' });
        }

        // Read document content 
        const documentContent = fs.readFileSync('document.txt', 'utf8');

        // Constructing the prompt that forces the model to rely only on the document
        const ragPrompt = `
        You are a helpful assistant. Answer the user's question based ONLY on the following context.
        If the answer is not in the context, say "I don't know based on the document."

        Context:
        ${documentContent}

        Question:
        ${userQuestion}
        `;

        // Send to model
        const result = await model.generateContent(ragPrompt);
        const responseText = result.response.text();

        res.json({ success: true, answer: responseText });
    } catch (error) {
        console.error('Error with RAG endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});