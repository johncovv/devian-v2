import { type Client, Events, REST, Routes } from "discord.js";

import { env } from "@/config/env";
import { generateCommandData } from "@/shared/utils/generate-command-data";

export default {
	type: Events.ClientReady,
	once: false,
	async execute(client: Client) {
		const rest = new REST({ version: "10" }).setToken(env.TOKEN);

		try {
			const interactCommands = Array.from(client.commands.values()).filter((c) => c.type === "INTERACTION");

			await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
				body: generateCommandData(interactCommands as Array<ICommand<"INTERACTION">>),
			});

			console.log("Successfully registered application commands.");
		} catch (error) {
			console.error(error);
		}
	},
};
