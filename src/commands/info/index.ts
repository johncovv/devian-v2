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

		if (type == null) return;

		if (this.optionFunctions?.[type] == null) {
			return await interaction.reply({
				content: `I don't know what you mean by \`${type}\``,
				ephemeral: true,
			});
		}

		await this.optionFunctions[type].execute(interaction);
	},
} satisfies ICommand;
