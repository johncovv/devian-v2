export default {
	name: "echo",
	description: "Return all the arguments passed",
	async execute(message, args) {
		await message.reply(args.join(", "));
	},
} as ICommand;
