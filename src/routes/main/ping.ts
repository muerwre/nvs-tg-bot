import { Request, Response } from "express";
import { CONFIG } from "$config/server";
import bot from "src/bot";

export default async (req: Request, res: Response) => {
  try {
    const { secret, to }: { secret: string, to: number } = req.body;

    if (!secret || !to || secret !== CONFIG.WATCHDOG.SECRET) {
      throw new Error("Incorrect secret");
    }

    const user = await bot.telegram.getMe()

    if (!user || !user.is_bot) {
      throw new Error("Incorrect secret");
    }

    return res.send("OK");
  } catch (e) {
    return res.sendStatus(403);
  }
};
