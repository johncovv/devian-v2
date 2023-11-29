import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { type IOptionFunction } from "@/@types/global.d";
import { env } from "@/config/env";

export default {
	name: "commands",
	description: "Get info about the bot",
	async execute(interaction: ChatInputCommandInteraction) {
		const messageEmbed = new EmbedBuilder();

		const sortedCommands = [...interaction.client.commands.values()].sort((a, b) => {
			if (a.type === "INTERACTION" && b.type === "MESSAGE") return -1;
			if (a.type === "MESSAGE" && b.type === "INTERACTION") return 1;
			return 0;
		});

		for (const command of sortedCommands) {
			messageEmbed.addFields({
				name: `${command.type === "INTERACTION" ? "/" : env.PREFIX}${command.name}`,
				value: command.description,
			});
		}

		await interaction.reply({
			embeds: [messageEmbed],
			ephemeral: true,
		});
	},
} satisfies IOptionFunction;
