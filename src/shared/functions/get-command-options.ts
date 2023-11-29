import type { Client } from "discord.js";
import path from "path";
import fs from "fs";

import type { IOptionFunction } from "@/@types/global";

const commandsPath = path.join(__dirname, "..", "..", "commands");

export async function getCommandOptions(client: Client, folderName: string) {
	const functionsMap: Record<string, IOptionFunction> = {};

	const setting = require(path.join(commandsPath, folderName, "setting")).default;

	let optionsFiles = fs.readdirSync(path.join(commandsPath, folderName));
	optionsFiles = optionsFiles.filter((file) => file.includes(".option"));

	const options = optionsFiles.map((file) => {
		return require(path.join(commandsPath, folderName, file)).default as IOptionFunction;
	});

	for (const option of options) {
		functionsMap[option.name] = option;
	}

	setting.optionFunctions = functionsMap;

	client.commands.set(setting.name, setting);
}
