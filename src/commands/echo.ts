export default {
	name: "echo",
	description: "Return all the arguments",
	type: "MESSAGE",
	async execute(message, args) {
		await message.reply(`Arguments: ${args.join(", ")}`);
	},
} satisfies ICommand;
