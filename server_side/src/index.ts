import express from "express";
import cors from "cors";

const app = express();

app.use(express.json())
app.use(cors())

app.get("/api/markers", async (req, res) => {
    res.json({message:"ahhhhhh"});
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
    
})