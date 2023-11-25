export default {
	name: "ping",
	description: "Reply with pong!",
	async execute(message, args) {
		message.reply("Pong 🏓");
	},
} as ICommand;
