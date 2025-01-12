import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware";
import { Request, Response } from "express";
const app = express();
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { db } from "@repo/db/client";

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
app.post("/login", async (req, res) => {
  const validatedData = SigninSchema.parse(req.body);
  if (!validatedData) {
    res.json(401);
  }
  const response = await db.user.findFirst({
    where: {
      username: validatedData.username,
    },
  });
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


  res.json({
    token,
  });
});

app.post("/room", middleware, async (req: Request, res: Response) => {
  console.log("IN room")
  const validatedData = CreateRoomSchema.parse(req.body);
  if (!validatedData) {
    res.status(403).json({
      message: "Incorrect inputs",
    });
    return;
  }
  const userId = req.user?.userId;
  if (!userId) return;

  try {
    console.log("Inside the room try catch block")
    const room = await db.room.create({
      data: {
        slug: validatedData.name,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (err) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});
