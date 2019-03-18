import { CONFIG } from "$config/server";

export const confirmationResponser = (req, res) => res.send(CONFIG.VK.test_response);
