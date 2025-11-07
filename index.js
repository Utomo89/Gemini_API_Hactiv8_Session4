import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
app.use(express.json());

// set gemini model for default
const GEMINI_MODEL = "gemini-2.5-flash";

// endpoint post for text
app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    res.status(200).json({ result: response.text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// endpoint for generate from image
app.post("/generate-from-image", async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// endpoint from document
app.post("/generate-from-document", upload.single("document"), async(req, res)=>{
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Please Help create summarize from this document. ", type: "text"},
        { inlineData: { data: base64Document, mimeType: req.file.mimetype}}
      ]
    });
    res.status(200).json({result: response.text})
  } catch (err) {
    console.log(err);
    res.status(500).json({message: err.message})
  }
})
// endpoint from audio
app.post("/generate-from-audio", upload.single("audio"), async(req, res)=>{
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Please Help create transcript from this audio.", type: "text"},
        { inlineData: { data: base64Audio, mimeType: req.file.mimetype}}

      ]
    })
    res.status(200).json({result: response.text})
  } catch (err) {
    console.log(err);
    res.status(500).json({message: err.message});
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Ready on http://localhost${PORT}`));
