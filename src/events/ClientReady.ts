import { Client, Events, Message, REST, Routes } from "discord.js";

import { env } from "@/config/env";

export default {
	type: Events.ClientReady,
	once: true,
	async execute(client: Client, message: Message) {
		const rest = new REST({ version: "10" }).setToken(env.TOKEN);

		try {
			await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
				body: Array.from(client.commands.values()),
			});

			console.log("Successfully registered application commands.");
		} catch (error) {
			console.error(error);
		}
	},
};
