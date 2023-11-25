// add commands on discord client (global)

import { ApplicationCommandOption, CacheType, ChatInputCommandInteraction, Collection, Message } from "discord.js";

interface IBaseCommand {
	name: string;
	description: string;
}

type TCommandType = "INTERACTION" | "MESSAGE";

declare global {
	type ICommand<Type extends TCommandType = TCommandType> = IBaseCommand &
		(Type extends "INTERACTION"
			? {
					type: Type;
					execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<unknown>;
					options?: ApplicationCommandOption[];
			  }
			: {
					type: Type;
					execute: (message: Message, args: Array<string>) => Promise<unknown>;
			  });
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, ICommand>;
	}
}

export {};
