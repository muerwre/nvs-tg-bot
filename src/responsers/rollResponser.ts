
import { CONFIG } from "$config/server";
import axios from "axios";

export const rollResponser = async (ctx, next) => {
  const diff = +new Date() / 1000 - ctx.message.date;

  if (diff >= 120) return next();

  const min = Math.min(ctx.match[1] || 0, ctx.match[2] || 0);
  const max = Math.max(ctx.match[1] || 0, ctx.match[2] || 0);
  const reply = await axios
    .get(CONFIG.FEATURES.RANDOM_URL.PROVIDER, { params: { min, max } })
    .catch(() => null);

  if (!reply || !reply.data || !reply.data.id) {
    await ctx.reply(
      `Ни одного маршрута, надо же! Но ты можешь создать свой:\n${CONFIG.FEATURES.RANDOM_URL.HOST}`,
      { disable_web_page_preview: true }
    );
    return next();
  }

  const description = reply.data.description
    ? `${reply.data.description}\n`
    : "";

  await ctx.reply(
    `${reply.data.title} (${reply.data.distance}км):\n${description}\n${CONFIG.FEATURES.RANDOM_URL.HOST}${reply.data.id}`,
    { disable_web_page_preview: true }
  );

  return next();
}