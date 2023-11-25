import { ChatInputCommandInteraction } from "discord.js";

import { IOptionFunction } from "@/@types/global.d";
import { env } from "@/config/env";

export default {
	name: "prefix",
	description: "Get the bot's prefix",
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`The prefix is **\`${env.PREFIX}\`**`);
	},
} as IOptionFunction;
