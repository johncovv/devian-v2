import { Client, Collection, GatewayIntentBits } from "discord.js";

import { env } from "@/config/env";
import { registerEvents } from "@/shared/utils/register-events";
import { registerCommands } from "@/shared/utils/register-commands";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

registerEvents(client);
registerCommands(client);

client.login(env.TOKEN);
