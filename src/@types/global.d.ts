// add commands on discord client (global)

import { Client, Collection, Message } from "discord.js";

declare global {
	interface ICommand {
		name: string;
		description: string;
		execute: (message: Message, args: string[]) => Promise<void>;
	}
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, ICommand>;
	}
}

export {};
