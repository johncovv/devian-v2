export default {
	name: "ping",
	description: "Reply with pong!",
	type: "MESSAGE",
	async execute(interaction) {
		await interaction.reply("Pong 🏓");
	},
} satisfies ICommand;
