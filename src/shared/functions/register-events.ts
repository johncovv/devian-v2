import type { Client } from "discord.js";
import path from "path";
import fs from "fs";

const eventsPath = path.join(__dirname, "..", "..", "events");

export async function registerEvents(client: Client) {
	const eventFiles = fs.readdirSync(eventsPath);

	for (const file of eventFiles) {
		const event = require(path.join(eventsPath, file)).default;

		if (event.ignore) continue;

		if (event.once) {
			client.once(event.type, (...args) => event.execute(client, ...args));
		} else {
			client.on(event.type, (...args) => event.execute(client, ...args));
		}
	}
}
