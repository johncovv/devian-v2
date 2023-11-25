import { Client } from "discord.js";
import path from "path";
import fs from "fs";

import { getCommandOptions } from "./get-command-options";

export async function registerCommands(client: Client) {
	const commands = fs.readdirSync(path.join(process.cwd(), "src", "commands"), { withFileTypes: true });

	for (const item of commands) {
		if (item.isFile()) {
			const command = require(path.join(process.cwd(), "src", "commands", item.name)).default;

			client.commands.set(command.name, command);
		}

		if (item.isDirectory()) {
			const folderName = item.name;

			await getCommandOptions(client, folderName);
		}
	}
}
