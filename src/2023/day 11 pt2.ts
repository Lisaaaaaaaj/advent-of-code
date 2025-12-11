let useData: string[] = [...realData];

type ProcessedData = {
	rowContainsNoGalaxy: Array<number>;
	columnsContainsNoGalaxy: Array<number>;
};

const dummyProcessedData: ProcessedData = { rowContainsNoGalaxy: [], columnsContainsNoGalaxy: [] };

const extendGalaxyAtEmptyRow = () => {
	useData.forEach((data, index) => {
		if (!data.match(/#/g)?.length && useData[index - 1].match(/#/g)?.length) {
			dummyProcessedData.rowContainsNoGalaxy.push(index);
		}
	});
};
extendGalaxyAtEmptyRow();

const calcEmptyGalaxyColumns = () =>
	[...useData.keys()].forEach((rowIndex) => {
		let rowWithoutGalaxy = true;

		useData.forEach((data) => {
			if (data.charAt(rowIndex).trim().includes('#')) {
				rowWithoutGalaxy = false;
			}
		});

		if (rowWithoutGalaxy) {
			dummyProcessedData.columnsContainsNoGalaxy.push(rowIndex);
		}
	});
calcEmptyGalaxyColumns();

const extendedGalaxy = [...useData];

let manyGalaxies = 0;
let galaxyName = 0;
let currentGalaxyPositions: {
	galaxyName: number;
	galaxyPos: number;
	galaxyRow: number;
	distance: Array<{ [key: string]: number }>;
}[] = [];

const determineCurrentGalaxyPositions = () =>
	extendedGalaxy.forEach((galx, rowIndex) => {
		const relInfo: {
			galaxyPos: number;
			galaxyRow: number;
			distance: Array<{ [key: string]: number }>;
			galaxyName: number;
		} = {
			galaxyPos: 0,
			galaxyRow: rowIndex,
			distance: [],
			galaxyName: 1,
		};

		manyGalaxies += galx.match(/#/g)?.length || 0;

		[...galx.matchAll(/#/g)].forEach((inx) => {
			galaxyName += 1;

			currentGalaxyPositions.push({
				...relInfo,
				galaxyPos: inx.index,
				galaxyName,
			});
		});
	});
determineCurrentGalaxyPositions();

const updateGalaxyPositions = (type: 'row' | 'column') => {
	const whichOne: {
		[key: string]: ['rowContainsNoGalaxy' | 'columnsContainsNoGalaxy', 'galaxyRow' | 'galaxyPos'];
	} = {
		row: ['rowContainsNoGalaxy', 'galaxyRow'],
		column: ['columnsContainsNoGalaxy', 'galaxyPos'],
	};

	const updateHowMany = 999999;

	currentGalaxyPositions = currentGalaxyPositions.map((currGalax) => {
		let update = false;

		const index = dummyProcessedData[whichOne[type][0]].filter(
			(noGalax) => noGalax < currGalax[whichOne[type][1]]
		);

		if (index.length) {
			update = true;
		}

		return {
			...currGalax,
			[whichOne[type][1]]: update
				? currGalax[whichOne[type][1]] + index.length * updateHowMany
				: currGalax[whichOne[type][1]],
		};
	});
};
updateGalaxyPositions('row');
updateGalaxyPositions('column');

const pairGalaxies = () => {
	let count = 1;
	currentGalaxyPositions.forEach((currVal) => {
		for (let i = count; i < manyGalaxies; i++) {
			currVal.distance.push({
				[`${count}-${i + 1}`]: 0,
			});
		}

		count += 1;
	});
};
pairGalaxies();

const measureDistanceBetweenGalaxies = () => {
	const updateDistance = [
		...currentGalaxyPositions.map((occ) => {
			occ.distance = occ.distance.filter((dis) => {
				const [currGalax] = Object.keys(dis)[0].split('-');

				return parseInt(currGalax, 10) === occ.galaxyName;
			});

			return occ;
		}),
	];

	updateDistance.forEach((currVal) => {
		currVal.distance = currVal.distance.map((dis) => {
			const [currGalax, nextGalax] = Object.keys(dis)[0].split('-');

			const nextRelevantGalx = updateDistance.find(
				(gal) => gal.galaxyName === parseInt(nextGalax, 10)
			);
			const currAndNextGalxOnSameRow = currVal.galaxyRow === nextRelevantGalx?.galaxyRow;
			const nextGalxPosGreaterThanCurrGalxPos =
				(nextRelevantGalx?.galaxyPos || 0) > currVal.galaxyPos;

			let distance = 0;

			if (currAndNextGalxOnSameRow) {
				distance = nextRelevantGalx.galaxyPos - currVal.galaxyPos;
			} else if (nextRelevantGalx) {
				if (nextGalxPosGreaterThanCurrGalxPos) {
					distance =
						nextRelevantGalx.galaxyPos -
						currVal.galaxyPos +
						(nextRelevantGalx.galaxyRow - currVal.galaxyRow);
				} else {
					distance =
						nextRelevantGalx.galaxyRow -
						currVal.galaxyRow +
						(currVal.galaxyPos - nextRelevantGalx.galaxyPos);
				}
			}

			return { [`${currGalax}-${nextGalax}`]: distance };
		});
	});

	return updateDistance;
};

const measuredGalaxies = measureDistanceBetweenGalaxies().filter((galax) => galax.distance.length);

let sumLengthAllDistances = 0;

measuredGalaxies.forEach((galaxy) => {
	galaxy.distance.forEach((dis) =>
		Object.values(dis).forEach((val) => (sumLengthAllDistances += val))
	);
});

console.log(sumLengthAllDistances);
