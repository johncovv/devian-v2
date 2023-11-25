import { env } from "@/config/env";
import { ApplicationCommandOptionType } from "discord.js";

export default {
	name: "info",
	description: "Get info about the bot",
	type: "INTERACTION",
	options: [
		{
			name: "type",
			description: "Get info about a specific part of the bot",
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: "prefix",
					value: "prefix",
				},
				{
					name: "bot",
					value: "bot",
				},
			],
		},
	],
	choices: ["prefix"],
	async execute(interaction) {
		const target = interaction.options.getString("type");

		switch (target) {
			case "prefix":
				return await interaction.reply(`The prefix is **\`${env.PREFIX}\`**`);
			case "bot":
				return await interaction.reply(`The bot is runnin on node version \`${process.version}\``);
			default:
				return await interaction.reply(`The target \`${target}\` is not valid`);
		}
	},
} as ICommand;
