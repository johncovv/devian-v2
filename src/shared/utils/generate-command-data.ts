import {
	ApplicationCommandOption,
	ApplicationCommandOptionType,
	SlashCommandBuilder,
	SlashCommandStringOption,
	ApplicationCommandOptionChoiceData,
} from "discord.js";

export function generateCommandData(commands: Array<ICommand<"INTERACTION">>) {
	const commandsBody = [];

	for (const command of commands) {
		const commandData = new SlashCommandBuilder().setName(command.name).setDescription(command.description);

		if (command.options) registerOptions(commandData, command.options);

		commandsBody.push(commandData);
	}
	return commandsBody;
}

function registerOptions(command: SlashCommandBuilder, options: Array<ApplicationCommandOption>) {
	for (const option of options ?? []) {
		switch (option.type) {
			case ApplicationCommandOptionType.String:
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
				break;
		}
	}
}
