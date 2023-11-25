import type { Client } from "discord.js";
import path from "path";
import fs from "fs";

export async function registerEvents(client: Client) {
	const eventFiles = fs.readdirSync(path.join(process.cwd(), "src", "events"));

	for (const file of eventFiles) {
		const event = require(path.join(process.cwd(), "src", "events", file)).default;

		if (event.ignore) continue;

		if (event.once) {
			client.once(event.type, (...args) => event.execute(client, ...args));
		} else {
			client.on(event.type, (...args) => event.execute(client, ...args));
		}
	}
}
