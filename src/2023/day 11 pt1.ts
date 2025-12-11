let useData: string[] = [...realData];

type ProcessedData = {
	columnsContainsNoGalaxy: Array<number>;
};

const dummyProcessedData: ProcessedData = { columnsContainsNoGalaxy: [] };

const extendGalaxyAtEmptyRow = () => {
	useData.forEach((data, index) => {
		if (!data.match(/#/g)?.length && useData[index - 1].match(/#/g)?.length) {
			useData.splice(index + 1, 0, new Array(data.length + 1).join('.'));
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

const extendGalaxyAtEmptyColumns = () =>
	(useData = useData.map((data) => {
		let newData = data;
		dummyProcessedData.columnsContainsNoGalaxy.forEach((columnIndex, index) => {
			newData =
				newData.slice(0, index === 0 ? columnIndex : columnIndex + index + 1) +
				'.' +
				newData.slice(index === 0 ? columnIndex : columnIndex + index + 1);
		});

		return newData;
	}));
extendGalaxyAtEmptyColumns();

const extendedGalaxy = [...useData];

let manyGalaxies = 0;
let galaxyName = 0;
const currentGalaxyPositions: {
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
