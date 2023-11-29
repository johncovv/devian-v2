import type { ApplicationCommandOption, CacheType, ChatInputCommandInteraction, Collection, Message } from "discord.js";
import type OpenAI from "openai";

interface IBaseCommand {
	name: string;
	description: string;
}

export interface IOptionFunction {
	name: string;
	description: string;
	execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<unknown> | unknown;
}

type TCommandType = "INTERACTION" | "MESSAGE";

export type TOptionFunc = Record<string, IOptionFunction>;

declare module "discord.js" {
	interface Client {
		commands: Collection<string, ICommand>;
		openAI: OpenAI;
	}
}

declare global {
	type ICommand<Type extends TCommandType = TCommandType> = IBaseCommand &
		(Type extends "INTERACTION"
			? {
					type: Type;
					execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<unknown> | unknown;
					options?: ApplicationCommandOption[];
					optionFunctions?: TOptionFunc;
			  }
			: {
					type: Type;
					execute: (message: Message, args: Array<string | number>) => Promise<unknown> | unknown;
			  });
}

export {};
