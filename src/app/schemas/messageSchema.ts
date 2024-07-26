import { z } from "zod";

export const messageSchema = z.object({
  acceptMessages: z
    .string()
    .min(10, { message: "Content must be atleast of 10 char" })
    .max(300, { message: "Content must be no longer than 300 char" }),
});
