export function getCommandAndArgs(content: string): [string, string[]] {
	const data = content.trim().split(/\s+/g);

	const [commandName, ...rest] = data;
	return [commandName, rest];
}
