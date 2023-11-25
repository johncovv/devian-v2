import { Client, Events, Message } from "discord.js";

import { env } from "@/config/env";
import { getCommandAndArgs } from "@/shared/utils/get-command-and-args";

export default {
	type: Events.MessageCreate,
	async execute(client: Client, message: Message) {
		if (message.author.bot) return;

		if (!message.content.startsWith(env.PREFIX)) return;

		const messageContent = message.content.slice(env.PREFIX.length).trim();

		const [commandName, ...args] = getCommandAndArgs(messageContent);

		const command = client.commands.get(commandName);

		if (!command || command.type !== "MESSAGE") return;

		try {
			await command.execute(message, ...args);
		} catch (error) {
			console.error(error);
		}
	},
};
