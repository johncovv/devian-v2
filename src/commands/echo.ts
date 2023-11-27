export default {
	name: "echo",
	description: "Return all the arguments",
	type: "MESSAGE",
	execute(message, args) {
		void message.reply(`Arguments: ${args.join(", ")}`);
	},
} satisfies ICommand;
