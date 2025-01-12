import express from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { middleware } from "./middleware";
const app = express();
dotenv.config();

app.listen(3001);   



app.post('/signup',async(req,res) => {
    //db call
    res.json({
        userId:"123"
    })
    
})
app.post('/login',async(req,res) => {
    const userId = 1;
    const token = jwt.sign({
        userId
    },process.env.JWT_SECRET as string)

    res.json({
        token
    })
})
app.post('/room',middleware,async(req,res) => {
    //db call 
    res.json({
        roomId:123
    })
})