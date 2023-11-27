import { type GuildTextBasedChannel, PermissionFlagsBits, ChannelType } from "discord.js";

export default {
	name: "clear",
	description: "Deletes a specified amount of messages from the current channel.",
	type: "MESSAGE",
	async execute(message, args) {
		const response = await message.channel.send("Clearing chat...");

		if (message.channel.type === ChannelType.DM) {
			void response.edit("You cannot clear the chat in a DM!");
			return;
		}

		if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
			void response.edit("You do not have permission to clear the chat!");
			return;
		}

		let [amount] = args ?? [];

		if (!amount || isNaN(Number(amount))) {
			void response.edit("You must provide a valid amount of messages to clear!");
			return;
		}

		amount = Number(amount);

		if (amount < 1) {
			void response.edit("You must delete at least 1 message!");
			return;
		}

		await deleteMessages(message.channel, amount);
	},
} satisfies ICommand;

async function deleteMessages(channel: GuildTextBasedChannel, amount: number) {
	if (amount > 100) {
		return await deleteMessages(channel, amount - 100);
	}

	return await channel.bulkDelete(amount, true);
}
