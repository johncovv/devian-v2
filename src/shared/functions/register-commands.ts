import type { Client } from "discord.js";
import path from "path";
import fs from "fs";

import { getCommandOptions } from "./get-command-options";

const commandsPath = path.join(__dirname, "..", "..", "commands");

export async function registerCommands(client: Client) {
	const commands = fs.readdirSync(commandsPath, { withFileTypes: true });

	for (const item of commands) {
		if (item.isFile()) {
			const command = require(path.join(commandsPath, item.name)).default;

			client.commands.set(command.name, command);
		}

		if (item.isDirectory()) {
			const folderName = item.name;

			await getCommandOptions(client, folderName);
		}
	}
}
