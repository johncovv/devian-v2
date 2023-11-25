import { ChatInputCommandInteraction } from "discord.js";

import { IOptionFunction } from "@/@types/global.d";

export default {
	name: "bot",
	description: "Get info about the bot",
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`The bot is runnin on node version \`${process.version}\``);
	},
} as IOptionFunction;
