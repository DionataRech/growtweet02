import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";
import { hash } from "bcrypt";
import { TweetType } from "@prisma/client";

class TweetController {
  public async create(req: Request, res: Response) {
    const { id } = req.params;
    const { description, type } = req.body;
    try {
      if (!description) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Description" });
      }
      const newTweets = await db.tweets.create({
        data: { description, type, userId: id },
      });
      return res.status(200).json({
        success: true,
        msg: "Tweet criado com sucesso",
        data: newTweets,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const getTweets = await db.tweets.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "List users.", data: getTweets });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async showTweet(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;
    try {
      const user = await db.users.findFirst({
        where: { token },
      });
      if (!user) {
        res.status(404).json({ success: false, msg: "User not found" });
      }
      const tweet = await db.tweets.findMany({
        where: { userId: id },
      });
      return res
        .status(200)
        .json({ success: true, msg: "Your Tweets", data: tweet });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred", error });
    }
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const description = req.body;
    try {
      const findTweet = await db.tweets.findUnique({ where: { id } });

      if (!findTweet) {
        return res.status(404).json({ success: true, msg: "Tweet not found." });
      }

      if (description) {
        await db.tweets.update({ where: { id }, data: { description } });
        return res.status(200).json({ success: true, msg: "Tweet updated." });
      }
      return res
        .status(404)
        .json({ success: false, msg: "Tweet not updated." });
    } catch (error) {
      res.status(404).json({ success: false, msg: "An error ocurred ", error });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const findTweet = await db.tweets.findUnique({
        where: { id },
      });

      if (findTweet) {
        await db.tweets.delete({ where: { id } });
        return res.status(200).json({ success: true, msg: "Tweet deleted." });
      }

      return res.status(404).json({ success: true, msg: "Tweet not found." });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}
export default TweetController;
