import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();


const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())

app.get("/api/markers", async (req, res) => {
    const markers = await prisma.marker.findMany();
    res.json(markers);
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
    
})