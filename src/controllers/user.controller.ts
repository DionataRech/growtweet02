import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";
import { hash } from "bcrypt";

class UserController {
  public async create(req: Request, res: Response) {
    const { name, email, password, userName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: true, msg: "Required fields." });
    }

    try {
      const userFind = await db.users.findUnique({
        where: { email },
      });

      if (!userFind) {
        const hash = generateHash(password);
        const newUser = await db.users.create({
          data: { password: hash, email, name, userName },
        });

        // console.log(hash);
        return res
          .status(200)
          .json({ success: true, msg: `${newUser.name} created sucess` });
      }
      return res.status(400).json({ success: true, msg: "User exist." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const users = await db.users.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "List users.", data: users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const showUser = await db.users.findUnique({
        where: { id },
      });
      return res.status(200).json({
        success: true,
        msg: "Its is a User",
        data: showUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default UserController;
