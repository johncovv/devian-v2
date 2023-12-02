/* eslint-disable @typescript-eslint/no-non-null-assertion */

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env.local") });

export const env = {
	TOKEN: process.env.TOKEN!,
	CLIENT_ID: process.env.CLIENT_ID!,
	PREFIX: process.env.PREFIX ?? "!",

	use_azure_openai: process.env.USE_AZURE_OPENAI === "true",

	openai: {
		KEY: process.env.OPENAI_TOKEN!,
	},

	azure: {
		OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT!,
		OPENAI_KEY: process.env.AZURE_OPENAI_KEY!,
		OPENAI_MODEL: process.env.AZURE_OPENAI_MODEL!,
	},
};
