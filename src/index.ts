import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

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

	client.commands = new Collection();

	await registerCommands(client);
	await registerEvents(client);

	void client.login(env.TOKEN);
})();
