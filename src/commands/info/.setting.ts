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
					name: "Prefix",
					value: "prefix",
				},
				{
					name: "Bot",
					value: "bot",
				},
				{
					name: "Commands",
					value: "commands",
				},
			],
		},
	],
	async execute(interaction) {
		const type = interaction.options.getString("type");

		if (!type) return;

		this.optionFunctions?.[type].execute(interaction);
	},
} as ICommand;
