import { env } from "@/config/env";

export default {
	name: "info",
	description: "Get info about the bot",
	async execute(message, args) {
		message.reply(`The bot prefix is \`${env.PREFIX}\``);
	},
} as ICommand;
