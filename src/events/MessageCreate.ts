import { type Client, type Message, ChannelType, Events } from "discord.js";

import { env } from "@/config/env";
import { getCommandAndArgs } from "@/shared/utils/get-command-and-args";
import { askOpenAI } from "@/shared/functions/ask-openai";

export default {
	type: Events.MessageCreate,
	async execute(client: Client, message: Message) {
		if (message.author.bot) return;

		if (message.channel.type === ChannelType.DM) {
			await handleDirectMessage(message);
			return;
		}

		if (!message.content.startsWith(env.PREFIX)) return;

		return handleCommand(message);
	},
};

function handleCommand(message: Message) {
	const messageContent = message.content.slice(env.PREFIX.length).trim();

	const [commandName, ...args] = getCommandAndArgs(messageContent);

	const command = message.client.commands.get(commandName);

	if (!command || command.type !== "MESSAGE") return;

	try {
		return command.execute(message, ...args);
	} catch (error) {
		console.error(error);
	}
}

async function handleDirectMessage(message: Message) {
	if (message.content.startsWith(env.PREFIX)) {
		return handleCommand(message);
	}

	await askOpenAI(message, message.content);
}
