import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();



const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())

app.get('/api/markers', async (req, res) => {
    try {
        const markers = await prisma.$queryRaw`
            SELECT * FROM "public"."Marker" ORDER BY name ASC
        `;
        res.json(markers);
    } catch (error) {
        console.error('Error fetching markers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/markers', async (req, res)=>{
    const {name, Latitude, Longitude} = req.body;
    try {
        if (!name || !Latitude || !Longitude) {
            return res
            .status(400)
            .send("didn't fill completly")
        }

        const marker = prisma.marker.create({
            data:{name, Latitude, Longitude}
        })

        res.json(marker)
        
    } catch (error) {
        res.status(500).send("oooooooooooooof :(")
    }
});

app.delete('/api/markers/:name', async (req, res) => {
    const name = req.params.name;
    try {
        await prisma.$executeRaw`DELETE FROM "public"."Marker" WHERE name = ${name}`;
        res.status(204).send(); // No content response for successful deletion
    } catch (error) {
        console.error('Error deleting marker:', error);
        res.status(500).send("Server Error");
    }
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
    
})