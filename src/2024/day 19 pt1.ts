const [workableTowels, workableDesigns] = realData.split(/\n\n\t/g);

const findDesigns = (designs: string, towels: string) => {
	const designIsFound = (design: string) => {
		if (design === '') {
			return true;
		}

		for (const towel of new Set(towels.split(', '))) {
			if (design.startsWith(towel) && designIsFound(design.slice(towel.length))) {
				return true;
			}
		}

		return false;
	};

	return designs
		.split(/\n\t/g)
		.map(designIsFound)
		.reduce((sum, possible) => sum + (possible ? 1 : 0), 0);
};

const ans = findDesigns(workableDesigns, workableTowels);

console.log(ans);
