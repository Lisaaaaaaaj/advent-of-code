let num = 0;

const seedsAndRangeArr = seeds.split(/\n/).filter((filt) => filt !== '');

const seedsWithLocation = seedsAndRangeArr.flatMap((seedAndRange) => {
	const [seed, range] = seedAndRange.split(' ');

	return {
		location: 0,
		range: [[Number(seed), Number(seed) + Number(range) - 1]],
	};
});

const bla = Object.entries(realData);

const seedsWithFoundLocation = [];

for (let i = 0; i < seedsWithLocation.length; i++) {
	let relevantLowestLocation = 0;

	try {
		for (let p = 0; p < seedsWithLocation[i].range.length; p++) {
			const matchedSrcIndex = seedsWithLocation[i].range[p][0];
			const matchedSrcEnd = seedsWithLocation[i].range[p][1];

			const ranges = [[matchedSrcIndex, matchedSrcEnd]];

			for (let z = 0; z < bla.length; z++) {
				const modifiedCurrentMap = bla[z][1].split(/\n/).filter((filt) => filt !== '');

				for (let o = 0; o < ranges.length; o++) {
					for (let x = 0; x < modifiedCurrentMap.length; x++) {
						const [dest, src, range] = modifiedCurrentMap[x].split(' ');
						const srcIndex = Number(src);
						const destIndex = Number(dest);

						if (
							ranges[o] &&
							ranges[o][0] >= srcIndex &&
							ranges[o][0] <= srcIndex + Number(range) - 1
						) {
							ranges[o][0] = ranges[o][0] - srcIndex + destIndex;
							ranges[o][1] = ranges[o][1] - srcIndex + destIndex;

							break;
						} else if (ranges[o][0] <= srcIndex && ranges[o][1] > srcIndex) {
							const newCurrentRangeEnd = ranges[o][1];
							const newCurrentRangeStart = srcIndex;
							const convertedToNewDestStart = newCurrentRangeStart - srcIndex + destIndex;
							const convertedToNewDestEnd = newCurrentRangeEnd - srcIndex + destIndex;

							const toSplitCurrentIndx = ranges[o][0];

							ranges[o][0] = convertedToNewDestStart;
							ranges[o][1] = convertedToNewDestEnd;

							ranges.push([toSplitCurrentIndx, srcIndex]);

							break;
						}
					}
				}
			}
			relevantLowestLocation = Math.min(...ranges.map((range) => range[0]));
		}
	} catch {
		console.warn('Maximum call stack size exceeded');
	}

	seedsWithFoundLocation.push(relevantLowestLocation);
}

const lowestSeedWithLocation = Math.min(...seedsWithFoundLocation.map((seed) => seed));

num = lowestSeedWithLocation;

console.log(num);
