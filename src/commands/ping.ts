export default {
	name: "ping",
	description: "Reply with pong!",
	type: "MESSAGE",
	execute(interaction) {
		void interaction.reply("Pong 🏓");
	},
} satisfies ICommand;
