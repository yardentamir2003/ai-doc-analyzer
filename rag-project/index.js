require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const app = express();
const multer = require('multer');
const pdf = require('pdf-extraction');
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(express.static('public'));

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
        If the answer is not in the context, politely state that you do not know based on the document. 
        IMPORTANT: You must write this fallback response in the exact same language the user used to ask the question.
        

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

app.post('/api/ask-pdf', upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        const userQuestion = req.body.question;

        if (!file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }
        if (!userQuestion) {
            return res.status(400).json({ error: 'Please provide a question' });
        }

        
        const parseFunction = typeof pdf === 'function' ? pdf : (pdf.PDFParse || pdf.default);
        
        // Extract text from PDF
        const pdfData = await pdf(file.buffer);
        const documentContent = pdfData.text;

        // Constructing the prompt that prevents the model from fabricating information
        const ragPrompt = `
        You are a helpful assistant. Answer the user's question based ONLY on the following context.
        If the answer is not in the context, say "I don't know based on the document."

        Context:
        ${documentContent}

        Question:
        ${userQuestion}
        `;

        // Send request to Gemini
        const result = await model.generateContent(ragPrompt);
        res.json({ success: true, answer: result.response.text() });

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});