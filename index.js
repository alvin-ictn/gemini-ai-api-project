import { GoogleGenAI } from "@google/genai";

import { GoogleGenerativeAI } from "@google/generative-ai"
import "dotenv/config"
import express from "express"
import { readFileSync } from "fs"
import multer from "multer";
import path from "path";

const port = process.env.PORT || 3300;
const app = express();
app.use(express.json());

const ai2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model2 = ai2.getGenerativeModel({
    model: "models/gemini-1.5-flash"
})

// setting multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    // Process the file as needed
    res.send(`File uploaded successfully: ${file.originalname}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body || "write story about ai and magic";
    try {
        const result = await model2.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        res.status(200).json({ output: text });
    } catch (error) {
        res.status(500).json({ error: error.message || "An error occurred while generating text." });
    }
});

const imageGeneratePart = (filePath) => ({
    inlineData: {
        data: readFileSync(filePath).toString('base64'),
        mimeType: 'image/jpeg',
    }
})

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const { prompt } = req.body || "describe the picture";
    const image = imageGeneratePart(req.file.path);
    try {
        const result = await model2.generateContent([prompt, image]);
        const response = result.response;
        const text = response.text();
        res.status(200).json({ output: text });
    } catch (error) {
        res.status(500).json({ error: error.message || "An error occurred while generating the image." });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
