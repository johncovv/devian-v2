import { askOpenAI } from "@/shared/functions/ask-openai";
import { ApplicationCommandOptionType } from "discord.js";

export default {
	name: "ask",
	type: "INTERACTION",
	description: "Ask a question to the bot.",
	options: [
		{
			name: "question",
			description: "The question you want to ask.",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	async execute(interaction) {
		let question = interaction.options.getString("question");

		if (!question) {
			await interaction.reply("You need to provide a question.");
			return;
		}

		question = question.trim();

		await interaction.deferReply({ ephemeral: true, fetchReply: true });

		await askOpenAI(interaction, question, { isInteraction: true });
	},
} satisfies ICommand;
