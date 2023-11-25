import { type CacheType, type ChatInputCommandInteraction, type Client, Events, type Interaction } from "discord.js";

export default {
	type: Events.InteractionCreate,
	async execute(client: Client, interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command || command.type !== "INTERACTION") return;

		try {
			await command.execute(interaction as ChatInputCommandInteraction<CacheType>);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	},
};
