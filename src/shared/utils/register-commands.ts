import { Client } from "discord.js";
import path from "path";
import fs from "fs";

export async function registerCommands(client: Client) {
	const commandFiles = fs.readdirSync(path.join(process.cwd(), "src", "commands"));

	for (const file of commandFiles) {
		const command = require(path.join(process.cwd(), "src", "commands", file)).default;

		client.commands.set(command.name, command);
	}
}
