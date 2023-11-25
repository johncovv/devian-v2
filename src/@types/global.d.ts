import type { ApplicationCommandOption, CacheType, ChatInputCommandInteraction, Collection, Message } from "discord.js";

interface IBaseCommand {
	name: string;
	description: string;
}

export interface IOptionFunction {
	name: string;
	description: string;
	execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<unknown>;
}

type TCommandType = "INTERACTION" | "MESSAGE";

export type TOptionFunc = Record<string, IOptionFunction>;

declare module "discord.js" {
	interface Client {
		commands: Collection<string, ICommand>;
	}
}

declare global {
	type ICommand<Type extends TCommandType = TCommandType> = IBaseCommand &
		(Type extends "INTERACTION"
			? {
					type: Type;
					execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<unknown>;
					options?: ApplicationCommandOption[];
					optionFunctions?: TOptionFunc;
			  }
			: {
					type: Type;
					execute: (message: Message, args: string[]) => Promise<unknown>;
			  });
}

export {};
