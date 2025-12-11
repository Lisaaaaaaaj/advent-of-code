const workableData = [...realData];

const naughtyOrNice = (str: string) => {
	const permutations = function (s: string, slots_no: number) {
		const result: string[] = [];
		const chars_left = new Map();

		for (const c of s) {
			chars_left.set(c, (chars_left.get(c) || 0) + 1);
		}

		const f = (slots_left: number, partial = '') => {
			if (slots_left === 0) {
				result.push(partial);
				return;
			}
			for (const c of s) {
				if (chars_left.get(c) > 0) {
					chars_left.set(c, (chars_left.get(c) || 0) - 1);
					f(slots_left - 1, partial + c);
					chars_left.set(c, (chars_left.get(c) || 0) + 1);
				}
			}
		};

		f(slots_no);

		return [...new Set(result)];
	};

	if (
		[...str.split('')].filter(s => str.match(new RegExp(`${s}.${s}`, 'g')))
			.length === 0
	) {
		return false;
	}
	if (
		permutations(str, 2).filter(
			s =>
				[...str.matchAll(new RegExp(`(${s})`, 'g'))].map(f => f.length).length >
				1
		).length === 0
	) {
		return false;
	}

	return true;
};

const niceCount = workableData.map(d => naughtyOrNice(d)).filter(f => f).length;

console.log(niceCount);
