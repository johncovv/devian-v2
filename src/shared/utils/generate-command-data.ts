import { type ApplicationCommandOption, ApplicationCommandOptionType, SlashCommandBuilder } from "discord.js";

import { commandOptionBuilder } from "@/shared/machine/command-option-builder";

export function generateCommandData(commands: Array<ICommand<"INTERACTION">>) {
	const commandsBody = [];

	for (const command of commands) {
		const commandData = new SlashCommandBuilder().setName(command.name).setDescription(command.description);

		if (command.options) registerOptions(commandData, command.options);

		commandsBody.push(commandData);
	}
	return commandsBody;
}

function registerOptions(command: SlashCommandBuilder, options: ApplicationCommandOption[]) {
	for (const option of options ?? []) {
		switch (option.type) {
			case ApplicationCommandOptionType.String:
				commandOptionBuilder[option.type](command, options);
				break;
		}
	}
}
