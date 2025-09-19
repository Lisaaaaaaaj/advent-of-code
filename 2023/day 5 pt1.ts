let num = 0;

const seedsArr = seeds.split(' ');

let seedsWithLocation = seedsArr.map((seed) => {
	return { seed, location: 0 };
});

const bla = Object.entries(realData);

seedsWithLocation = seedsWithLocation.map(({ seed, location }) => {
	let returnSeedsWithLocation = { seed, location };

	const findLocation = (currentMap, seedRelatedNumber, currentMapIndex) => {
		const key = currentMap[0];
		const matchedSrcIndex = Number(seedRelatedNumber);

		const modifiedCurrentMap = currentMap[1].split(/\n/).filter((filt) => filt !== '');
		let findRelatedNumberCurrentSrc = matchedSrcIndex;

		for (let i = 0; i < modifiedCurrentMap.length; i++) {
			const [dest, src, range] = modifiedCurrentMap[i].split(' ');
			const srcIndex = Number(src);
			const destIndex = Number(dest);

			if (matchedSrcIndex >= srcIndex && matchedSrcIndex <= srcIndex + Number(range)) {
				const relevantRangeToFindDestIndex = matchedSrcIndex - srcIndex;

				findRelatedNumberCurrentSrc = destIndex + relevantRangeToFindDestIndex;
				break;
			}
		}

		const grrr = Number(findRelatedNumberCurrentSrc);

		if (grrr !== matchedSrcIndex) {
			if (key === 'humidity-to-location map') {
				returnSeedsWithLocation = { seed, location: grrr };

				return returnSeedsWithLocation;
			}

			findLocation(bla[currentMapIndex + 1], grrr, (currentMapIndex += 1));
		} else {
			if (key === 'humidity-to-location map') {
				returnSeedsWithLocation = { seed, location: Number(matchedSrcIndex) };

				return returnSeedsWithLocation;
			}

			findLocation(bla[currentMapIndex + 1], matchedSrcIndex, (currentMapIndex += 1));
		}
	};

	findLocation(bla[0], seed, 0);

	return returnSeedsWithLocation;
});

console.log(seedsWithLocation);

const lowestSeedWithLocation = Math.min(...seedsWithLocation.map((seed) => seed.location));

num = lowestSeedWithLocation;

console.log(num);
