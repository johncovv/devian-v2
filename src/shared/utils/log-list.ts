type LogItem = string | number | null;

export function logList(list: LogItem[]) {
	for (const item of list) {
		if (item == null) {
			console.log(`\n`);
			continue;
		}

		console.info(item);
	}
}
