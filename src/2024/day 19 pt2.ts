const [workableTowels, workableDesigns] = dummyData.split(/\n\n\t/g);

const findDesigns = (designs: string, towels: string) => {
	const cache = new Map();

	const designIsFound = (design: string) => {
		if (cache.has(design)) {
			return cache.get(design);
		}

		if (design === '') {
			return 1;
		}

		let combinations = 0;
		for (const towel of new Set(towels.split(', '))) {
			if (design.startsWith(towel)) {
				combinations += designIsFound(design.slice(towel.length));
			}
		}

		cache.set(design, combinations);
		return combinations;
	};

	return designs.split(/\n\t/g).reduce((sum, d) => sum + designIsFound(d), 0);
};

const ans = findDesigns(workableDesigns, workableTowels);

console.log(ans);
