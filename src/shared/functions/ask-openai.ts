import { ChannelType, type CacheType, type ChatInputCommandInteraction, type Message } from "discord.js";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

type Event = Message | ChatInputCommandInteraction<CacheType>;

export async function askOpenAI(event: Event, question: string, { isInteraction = false } = {}) {
	if (!event.channel) return;

	let typingInterval: NodeJS.Timeout | undefined = undefined;

	if (!isInteraction) {
		void event.channel.sendTyping(); // first typing to avoid the 5 seconds delay

		typingInterval = setInterval(() => {
			void event.channel?.sendTyping();
		}, 5000);
	}

	try {
		const last10Messages = await event.channel.messages.fetch({ limit: 15, before: event.id });

		const filteredLast10Messages = filterLastMessages(last10Messages);

		const { openAI } = event.client;

		const response = await openAI.chat.completions.create({
			model: "gpt-3.5-turbo-16k-0613",
			n: 1,
			messages: [
				{
					role: "system",
					content:
						"You are a discord bot listening to a user. The user can ask anithing, but if is related with development use typescript as default language. You need to read all the messages that is provided, but focus on the last message.",
				},
				...filteredLast10Messages,
				{
					role: "user",
					content: question,
				},
			],
		});

		typingInterval && clearInterval(typingInterval);

		const fullMessage = response.choices[0].message.content ?? "No response from bot.";

		/** if the message is too long, split it in chunks of 2000 characters */
		if (fullMessage.length > 2000) {
			const chunks = fullMessage.match(/[\s\S]{1,2000}/g) ?? [];

			for (const chunk of chunks) {
				/** if the channer is DM, send the response on the channel */
				if (event.channel.type === ChannelType.DM) {
					await event.channel.send(chunk);
					continue;
				}

				/** if the channel is not DM, redirect the response to the users DM */
				await (await (event as Message).author.createDM()).send(chunk);
				continue;
			}
			return;
		}

		if (isInteraction) {
			await (event as ChatInputCommandInteraction<CacheType>).editReply(fullMessage);
		} else {
			await event.reply(fullMessage);
		}
	} catch (error: any) {
		console.error("Error: ", error.message ?? error);

		if (error.message) {
			await event.reply(error.message);
			return;
		}

		await event.reply("Something went wrong!");

		typingInterval && clearInterval(typingInterval);
	}
}

function filterLastMessages(lastMessages: Map<string, Message>) {
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
