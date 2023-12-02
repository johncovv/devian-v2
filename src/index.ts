import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import OpenAI from "openai";

import { env } from "@/config/env";
import { registerEvents } from "@/shared/functions/register-events";
import { registerCommands } from "@/shared/functions/register-commands";

void (async () => {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildIntegrations,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.DirectMessages,
		],
		partials: [Partials.Channel],
	});

	if (env.openai.KEY) {
		client.openAI = new OpenAI({ apiKey: env.openai.KEY });
	}

	if (env.azure.OPENAI_KEY) {
		client.azureOpenAI = new OpenAIClient(env.azure.OPENAI_ENDPOINT, new AzureKeyCredential(env.azure.OPENAI_KEY));
	}

	client.commands = new Collection();

	await registerCommands(client);
	await registerEvents(client);

	void client.login(env.TOKEN);
})();
