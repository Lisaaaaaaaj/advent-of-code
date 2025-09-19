const workableData = [...realData];

const naughtyOrNice = (str: string) => {
	const findFirstRepeatedChar = (s: string[]) => {
		for (let i = 0; i < s.length; i++) {
			if (s[i] == s[i + 1]) {
				return true;
			}
		}

		return false;
	};

	if ([...str.matchAll(/(ab|cd|pq|xy)/g)].map((s) => s.length).length > 0) {
		return false;
	}
	if ([...str.matchAll(/(a|e|i|o|u)/g)].map((s) => s.length).length < 3) {
		return false;
	}
	if (!findFirstRepeatedChar([...str])) {
		return false;
	}

	return true;
};

const niceCount = workableData.map((d) => naughtyOrNice(d)).filter((f) => f).length;

console.log(niceCount);
