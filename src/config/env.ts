/* eslint-disable @typescript-eslint/no-non-null-assertion */

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

export const env = {
	TOKEN: process.env.TOKEN!,
	CLIENT_ID: process.env.CLIENT_ID!,
	PREFIX: process.env.PREFIX ?? "!",
	OPENAI_TOKEN: process.env.OPENAI_TOKEN!,
};
