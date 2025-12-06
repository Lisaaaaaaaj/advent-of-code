let num = 0;

type Tile = {
	char: string;
	matches: string[];
	lineColIndex: number;
	lineRowIndex: number;
};

const pipeDirections: { [key: string]: string[] } = {
	'|': ['n', 's'],
	'-': ['e', 'w'],
	L: ['n', 'e'],
	J: ['n', 'w'],
	7: ['s', 'w'],
	F: ['s', 'e'],
	S: ['n', 'w', 's', 'e'],
};

const map = realData.map((line, lineIndex) => {
	const lineCollection: Tile[] = [];

	[...line].map((linePart, linePartIndex) => {
		const currentLinePartIsAPipe = !linePart?.match(/\./g);

		if (currentLinePartIsAPipe) {
			lineCollection.push({
				char: linePart,
				matches: pipeDirections[linePart],
				lineColIndex: linePartIndex,
				lineRowIndex: lineIndex,
			});
		}
	});

	return lineCollection;
});

const findRelevantNextNewDirections = (
	line: Tile,
	currentLineIndex: number,
	previousRelevantTile?: Tile
) => {
	const relevantPaths: Array<Tile> = [];

	if (line.char === 'S' && previousRelevantTile) {
		return relevantPaths;
	}

	const currentPipeIndex = line.lineColIndex;
	const currentPipeIndexLeft = line.lineColIndex - 1;
	const currentPipeIndexRight = line.lineColIndex + 1;

	const thisLine = map[currentLineIndex];
	const prevLine = map[currentLineIndex - 1];
	const nextLine = map[currentLineIndex + 1];

	const pushAndFilterRelevantChar = (revLine: Tile[], type: 'prev' | 'this' | 'next') => {
		return revLine.filter((rvLine) => {
			if (
				((type === 'prev' || type === 'next') && rvLine.lineColIndex === currentPipeIndex) ||
				(type === 'this' &&
					(rvLine.lineColIndex === currentPipeIndex ||
						rvLine.lineColIndex === currentPipeIndexLeft ||
						rvLine.lineColIndex === currentPipeIndexRight))
			) {
				relevantPaths.push(rvLine);
			}

			return rvLine;
		});
	};

	if (prevLine) {
		pushAndFilterRelevantChar(prevLine, 'prev');
	}
	pushAndFilterRelevantChar(thisLine, 'this');
	if (nextLine) {
		pushAndFilterRelevantChar(nextLine, 'next');
	}

	return relevantPaths;
};

const findStart = map.flatMap((currentLine, currentLineIndex) => {
	let relevantPaths: Array<Tile> = [];

	currentLine.map((line) => {
		if (line.char === 'S') {
			relevantPaths = findRelevantNextNewDirections(line, currentLineIndex, undefined);
		}
	});

	return relevantPaths;
});

const findNextDirectionTile = (tiles: Tile[], relevantTile: Tile) => {
	const foundTiles = tiles.filter((tile) => {
		const oppositeDir: { [key: string]: string } = {
			n: 's',
			s: 'n',
			e: 'w',
			w: 'e',
		};
		const directionJointWithStart = (direction: string) => {
			return (
				tile.matches.find((match) => oppositeDir[direction] === match) &&
				relevantTile.matches.includes(direction)
			);
		};

		if (
			relevantTile.lineRowIndex < tile.lineRowIndex &&
			relevantTile.lineColIndex === tile.lineColIndex &&
			directionJointWithStart('s')
		) {
			return tile;
		} else if (
			relevantTile.lineRowIndex === tile.lineRowIndex &&
			relevantTile.lineColIndex > tile.lineColIndex &&
			directionJointWithStart('w')
		) {
			return tile;
		} else if (
			relevantTile.lineRowIndex === tile.lineRowIndex &&
			relevantTile.lineColIndex < tile.lineColIndex &&
			directionJointWithStart('e')
		) {
			return tile;
		} else if (
			relevantTile.lineRowIndex > tile.lineRowIndex &&
			relevantTile.lineColIndex === tile.lineColIndex &&
			directionJointWithStart('n')
		) {
			return tile;
		}
	});

	return foundTiles;
};

const findStartingDirectionTile = (tiles: Tile[]) => {
	const startingTile = tiles.filter((tile) => tile.char === 'S')[0];
	let foundStartingTiles = tiles.filter((tile) => tile.char !== 'S');

	foundStartingTiles = findNextDirectionTile(tiles, startingTile);

	return foundStartingTiles[0];
};

const startingDirectionTile = findStartingDirectionTile(findStart);
let previousRelevantTile = startingDirectionTile;
let nextRelevantTileLine = startingDirectionTile.lineRowIndex;

let nextRelevantDirections = findRelevantNextNewDirections(
	startingDirectionTile,
	nextRelevantTileLine,
	undefined
).filter((tile) => tile.char !== 'S');

let nextRelevantDirectionTile;
let startingPositionHasBeenFoundAgain = false;
let count = 0;

while (!startingPositionHasBeenFoundAgain) {
	count++;

	nextRelevantDirectionTile = findNextDirectionTile(
		nextRelevantDirections,
		previousRelevantTile
	)[0];

	nextRelevantTileLine = nextRelevantDirectionTile.lineRowIndex;

	nextRelevantDirections = findRelevantNextNewDirections(
		nextRelevantDirectionTile,
		nextRelevantTileLine,
		previousRelevantTile
	).filter(
		(tile) =>
			previousRelevantTile.lineColIndex !== tile.lineColIndex ||
			previousRelevantTile.lineRowIndex !== tile.lineRowIndex
	);

	if (nextRelevantDirections.length === 0) {
		startingPositionHasBeenFoundAgain = true;
		count += 1;
		break;
	}

	previousRelevantTile = nextRelevantDirectionTile;
}

console.log((num += count / 2));
