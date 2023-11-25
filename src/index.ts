import { Client, Collection, GatewayIntentBits } from "discord.js";

import { env } from "@/config/env";
import { registerEvents } from "@/shared/utils/register-events";
import { registerCommands } from "@/shared/utils/register-commands";

(async () => {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildIntegrations,
		],
	});

	client.commands = new Collection();

	await registerCommands(client);
	await registerEvents(client);

	client.login(env.TOKEN);
})();
