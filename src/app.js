import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./database/database.connection.js";

const app = express();

app.use(express.json()); 
app.use(cors()); 
dotenv.config(); 

app.get("/health", async (_req, res) => {
    const teste = await db.collection("votes").find().toArray()
    res.send(`Teste: ${teste}`);
  });

const PORT = 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));