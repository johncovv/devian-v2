import {
	type ApplicationCommandOption,
	type ApplicationCommandOptionChoiceData,
	type SlashCommandBuilder,
	ApplicationCommandOptionType,
	SlashCommandStringOption,
} from "discord.js";

type CommandOptionBuilder = Record<
	ApplicationCommandOptionType | number,
	(command: SlashCommandBuilder, options: ApplicationCommandOption[]) => void
>;

export const commandOptionBuilder: CommandOptionBuilder = {
	[ApplicationCommandOptionType.String](command, options) {
		for (const option of options ?? []) {
			if (option.type !== ApplicationCommandOptionType.String) continue;

			const stringOption = new SlashCommandStringOption()
				.setName(option.name)
				.setDescription(option.description)
				.setRequired(option.required ?? false);

			(option as any)?.choices?.forEach((choice: ApplicationCommandOptionChoiceData<string>) => {
				stringOption.addChoices({
					name: choice.name,
					value: choice.value,
				});
			});

			command.addStringOption(stringOption);
		}
	},
};
