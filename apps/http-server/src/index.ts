import express from "express";
import jwt from "jsonwebtoken";

import { verifyToken } from "./middleware";
import { Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { db } from "@repo/db/client";
import type { User} from "@repo/db/types";

const app = express();


app.use(express.json());

app.listen(3001);

app.post("/signup", async (req, res) => {
  //db call

  const validatedData = CreateUserSchema.parse(req.body);
  if (!validatedData) {
    res.json(404).json({
      message: "Invalid Data",
    });
  }

  try {
    const user = await db.user.create({
      data: {
        password: validatedData.password,
        username: validatedData.username,
        name: validatedData.name,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (err) {
    res.status(411).json({
      message: "User already exists with this username",
    });
  }
});
app.post("/login", async (req:Request, res) => {
  const validatedData = SigninSchema.parse(req.body);
  if (!validatedData) {
    res.json(401);
  }
  const response = await db.user.findFirst({
    where: {
      username: validatedData.username,
    },
    select:{
      id:true
    }
  });
  console.log("Response: ",response)
  if (!response) {
    res.status(403).json({
      message: "Not authorized",
    });
    return;
  }
  
  const token = jwt.sign(
    {
      userId: response.id,
    },
    JWT_SECRET as string
  );
  
  console.log("Token in login route: ",token)


  res.set("Authorization", `Bearer ${token}`);
  console.log(req.header('Authorization'))


  res.json({
    token,
  });
});

app.post("/room", verifyToken, async (req: Request, res: Response) => {

  console.log("IN room")

  console.log("User in the Request: ",req.user)
  const validatedData = CreateRoomSchema.parse(req.body);
  if (!validatedData) {
    res.status(403).json({
      message: "Incorrect inputs",
    });
    return;
  }
  const userId = req.user?.id;
  if (!userId) return;



    const room = await db.room.create({
      data: {
        slug: validatedData.name,
        adminId: userId,
      },
    });
    console.log(room)
    res.json({
      roomId: room.id,
    });


  
});

app.post("/chat/:roomId",async(req,res) => {
  try{
    const roomId = parseInt(req.params.roomId)
    const messages = await db.chat.findMany({
      where:{
        roomId
      },
      orderBy:{
        id : "desc"
      },
      take : 50
    });

    res.json({
      messages
    })
  }catch(err){
    console.error(err);
    res.json({
      messages:[]
    })
  }
})

app.post("/room/:slug",async(req,res) => {
  const slug = req.params.slug;
  const room = await db.room.findFirst({
    where:{
      slug
    }
  })

  res.json({
    room
  })
})

