import { type Client, Events, REST, Routes } from "discord.js";

import { env } from "@/config/env";
import { generateCommandData } from "@/shared/utils/generate-command-data";
import { logList } from "@/shared/utils/log-list";

export default {
	type: Events.ClientReady,
	once: false,
	async execute(client: Client) {
		const rest = new REST({ version: "10" }).setToken(env.TOKEN);

		try {
			const registeredCommands = Array.from(client.commands.values());

			const interactCommands = registeredCommands.filter((c) => c.type === "INTERACTION");
			const messageCommands = registeredCommands.filter((c) => c.type === "MESSAGE");

			await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
				body: generateCommandData(interactCommands as Array<ICommand<"INTERACTION">>),
			});

			logList([
				"----- STARTED -----",
				`🟢 Logged in as ${client.user?.tag}.`,
				`⚙️  Prefix: "${env.PREFIX}"`,
				"-",
				`📦 Registered ${interactCommands.length} interaction command(s).`,
				`📦 Registered ${messageCommands.length} message command(s).`,
				"----- FINISHED -----",
			]);
		} catch (error) {
			console.error(error);
		}
	},
};
