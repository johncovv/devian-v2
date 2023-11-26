import type { Client } from "discord.js";
import path from "path";
import fs from "fs";

import type { IOptionFunction } from "@/@types/global";

export async function getCommandOptions(client: Client, folderName: string) {
	const functionsMap: Record<string, IOptionFunction> = {};

	const setting = require(path.join(process.cwd(), "src", "commands", folderName, "setting.ts")).default;

	let optionsFiles = fs.readdirSync(path.join(process.cwd(), "src", "commands", folderName));
	optionsFiles = optionsFiles.filter((file) => file.endsWith(".option.ts"));

	const options = optionsFiles.map((file) => {
		return require(path.join(process.cwd(), "src", "commands", folderName, file)).default as IOptionFunction;
	});

	for (const option of options) {
		functionsMap[option.name] = option;
	}

	setting.optionFunctions = functionsMap;

	client.commands.set(setting.name, setting);
}
