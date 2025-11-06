import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import {GoogleGenAI} from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API });
app.use(express.json());

// set gemini model for default
const GEMINI_MODEL = "gemini-2.5-flash";

// endpoint
app.post('/generate-text', async (req, res)=>{
    const {prompt} = req.body;

    try {
        const response = await ai.models.generateContent({
            model : GEMINI_MODEL,
            contents : prompt
        });
        res.status(200).json({result: response.text});
    } catch (err) {
        console.log(err)
        res.status(500).json({message : err.message});
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Ready on http://localhost${PORT}`));