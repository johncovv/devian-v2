import { type Client, type Message, ChannelType, Events } from "discord.js";
import { type ChatCompletionMessageParam } from "openai/resources/chat";

import { env } from "@/config/env";
import { getCommandAndArgs } from "@/shared/utils/get-command-and-args";

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

	void message.channel.sendTyping(); // first typing to avoid the 5 seconds delay

	const typingInterval = setInterval(() => {
		void message.channel.sendTyping();
	}, 5000);

	try {
		const last10Messages = await message.channel.messages.fetch({ limit: 15, before: message.id });

		const filteredLast10Messages = filterLastMessages(message, last10Messages);

		const { openAI } = message.client;

		const response = await openAI.chat.completions.create({
			model: "gpt-3.5-turbo-16k-0613",
			n: 1,
			messages: [
				{
					role: "system",
					content:
						"You are a discord bot listening to a user. The user can ask anithing, but if is related with development, use typescript as default language. You need to read all the messages that is provided, but focus on the last message.",
				},
				{
					role: "system",
					content:
						"Your goal is to respond to the last message with a message that is relevant to the last message.",
				},
				{
					role: "system",
					content: "You have to respond within 5 seconds, or the user will think you are not listening.",
				},
				{
					role: "system",
					content: "NEVER pass the 2000 character limit.",
				},
				...filteredLast10Messages,
				{
					role: "user",
					content: message.content,
				},
			],
		});

		clearInterval(typingInterval);

		const fullMessage = response.choices[0].message.content ?? "No response";

		const chunks = fullMessage.match(/(.|[\r\n]){1,1999}/g);

		for (const chunk of chunks ?? []) {
			await message.channel.send(chunk);
		}
	} catch (error: any) {
		console.error("Error: ", error.message ?? error);

		if (error.message) {
			await message.reply(error.message);
			return;
		}

		await message.reply("Something went wrong!");
	}
}

function filterLastMessages(message: Message, lastMessages: Map<string, Message>) {
	let parsedLast10Messages = Array.from(lastMessages).map(([_, message]) => ({
		content: message.content,
		role: message.author.bot ? "assistant" : "user",
		timestamp: message.createdTimestamp,
	}));

	parsedLast10Messages = parsedLast10Messages.filter((message) => {
		return message.timestamp > Date.now() - 10 * 60 * 1000;
	});

	const filteredLast10Messages = parsedLast10Messages.map(
		({ timestamp, ...message }) => message,
	) as ChatCompletionMessageParam[];

	return filteredLast10Messages;
}
