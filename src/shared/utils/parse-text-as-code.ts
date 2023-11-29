export function parseTextAsCode(text: string, language = "js") {
	text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));

	return `\`\`\`${language}\n${text}\`\`\``;
}
