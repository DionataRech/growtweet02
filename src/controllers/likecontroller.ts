import { Request, Response } from "express";
import db from "../database/prisma.connection";

class LikeController {
  public async list(req: Request, res: Response) {
    try {
      const getLikes = await db.likes.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "All Likes", data: getLikes });
    } catch (error) {
      res.status(404).json({ success: false, msg: "An error ocurred ", error });
    }
  }
}

export default LikeController;
