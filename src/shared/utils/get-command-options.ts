import type { Client } from "discord.js";
import path from "path";
import fs from "fs";

import type { IOptionFunction } from "@/@types/global";

export async function getCommandOptions(client: Client, folderName: string) {
	const setting = require(path.join(process.cwd(), "src", "commands", folderName, "index.ts")).default;

	const optionsFiles = fs
		.readdirSync(path.join(process.cwd(), "src", "commands", folderName))
		.filter((file) => file !== "index.ts");

	const options = optionsFiles.map((file) => {
		return require(path.join(process.cwd(), "src", "commands", folderName, file)).default as IOptionFunction;
	});

	const functionsMap: Record<string, IOptionFunction> = {};

	for (const option of options) {
		functionsMap[option.name] = option;
	}

	setting.optionFunctions = functionsMap;

	client.commands.set(setting.name, setting);
}
