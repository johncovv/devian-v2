import { ChannelType, type CacheType, type ChatInputCommandInteraction, type Message } from "discord.js";
import type { ChatCompletionMessageParam, ChatCompletionRole } from "openai/resources/chat";

import { env } from "@/config/env";

type Event = Message | ChatInputCommandInteraction<CacheType>;
interface ChatMessage {
	role: ChatCompletionRole;
	content: string;
}

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
		const answer = await getAnswer(event, question);

		typingInterval && clearInterval(typingInterval);

		/** if the message is too long, split it in chunks of 2000 characters */
		if (answer.length > 2000) {
			const chunks = answer.match(/[\s\S]{1,2000}/g) ?? [];

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
			await (event as ChatInputCommandInteraction<CacheType>).editReply(answer);
		} else {
			await event.reply(answer);
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

	const filteredLast10Messages = parsedLast10Messages.map(({ timestamp, ...message }) => message);

	return filteredLast10Messages as ChatMessage[];
}

async function getAnswer(event: Event, question: string) {
	const last10Messages = await event.channel!.messages.fetch({ limit: 15, before: event.id });

	const filteredLast10Messages = filterLastMessages(last10Messages);

	const context: ChatMessage[] = [
		{
			role: "system",
			content:
				"You are a discord bot listening to a user. The user can ask anithing, but if is related with development use typescript as default language. You need to read all the messages that is provided, but focus on the last message.",
		},
		...filteredLast10Messages,
	];

	if (env.use_azure_openai) {
		const { azureOpenAI } = event.client;

		if (azureOpenAI == null) {
			throw new Error("This method is not configured.");
		}

		const response = await azureOpenAI.getChatCompletions(
			env.azure.OPENAI_MODEL,
			[...context, { role: "user", content: question }],
			{
				n: 1,
			},
		);

		return response.choices[0].message?.content ?? "I don't know what to say...";
	}

	const { openAI } = event.client;

	if (openAI == null) {
		throw new Error("This method is not configured.");
	}

	const response = await openAI.chat.completions.create({
		model: "gpt-3.5-turbo-16k-0613",
		n: 1,
		messages: [
			...(context as ChatCompletionMessageParam[]),
			{
				role: "user",
				content: question,
			},
		],
	});

	return response.choices[0].message.content ?? "No response from bot.";
}
