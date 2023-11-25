export default {
	name: "ping",
	description: "Reply with pong!",
	type: "MESSAGE",
	async execute(interaction) {
		interaction.reply("Pong 🏓");
	},
} as ICommand;
