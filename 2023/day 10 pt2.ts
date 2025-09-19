let halfwayNum = 0;
let enclosedNum = 0;

type TileDirection = 'n' | 'w' | 's' | 'e';
type TileFace = 'u' | 'd' | 'l' | 'r';
type Tile = {
	char: string;
	matches: string[];
	lineColIndex: number;
	lineRowIndex: number;
	status: 'unspecified' | 'part_of_main_loop' | 'enclosed' | 'not_enclosed';
	faceDirections: {
		face: 'unspecified' | TileFace[] | TileFace;
		direction: 'unspecified' | TileDirection;
		'90degreeFaces'?: { '|': 'unspecified' | TileFace; '-': 'unspecified' | TileFace };
	};
};

const pipeDirections: { [key: string]: string[] } = {
	'|': ['n', 's'],
	'-': ['e', 'w'],
	L: ['n', 'e'],
	J: ['n', 'w'],
	'7': ['s', 'w'],
	F: ['s', 'e'],
	S: ['n', 'w', 's', 'e'],
};

const faceDirections: { [key: string]: TileFace[] } = {
	ns: ['l', 'r'],
	ew: ['u', 'd'],
	en: ['r', 'u'],
	nw: ['u', 'l'],
	sw: ['d', 'l'],
	es: ['r', 'd'],
};

const realMap = realData.map((line, lineIndex) => {
	const lineCollection: Tile[] = [];

	[...line].map((linePart, linePartIndex) => {
		const currentLinePartIsAPipe = !linePart?.match(/\./g);
		const currentLinePartIsGround = !currentLinePartIsAPipe;

		if (currentLinePartIsAPipe) {
			lineCollection.push({
				char: linePart,
				matches: pipeDirections[linePart],
				lineColIndex: linePartIndex,
				lineRowIndex: lineIndex,
				status: 'unspecified',
				faceDirections: { face: 'unspecified', direction: 'unspecified' },
			});
		} else if (currentLinePartIsGround) {
			lineCollection.push({
				char: '.',
				matches: [],
				lineColIndex: linePartIndex,
				lineRowIndex: lineIndex,
				status: 'unspecified',
				faceDirections: { face: 'unspecified', direction: 'unspecified' },
			});
		}
	});

	return lineCollection;
});

const makeStartPositionWorkable = () => {
	for (let i = 0; i < realMap.length; i++) {
		const startRowLine = realMap
			.map((mp) => mp.findIndex((line) => line.char === 'S'))
			.filter((arg) => arg !== -1)[0];
		const startRow = realMap[i][startRowLine];
		let changeStartRow = false;

		if (startRow.char === 'S') {
			const prevRow = realMap[i - 1][startRowLine];
			const nextRow = realMap[i + 1][startRowLine];

			if (prevRow.char === '|' && nextRow.char === '|') {
				startRow.char = '|';
				changeStartRow = true;
			}
		}

		if (changeStartRow) {
			let hasFound90DegreeChar = false;

			while (!hasFound90DegreeChar) {
				for (let j = i; j < realMap[startRowLine].length; j++) {
					if (
						realMap[j + 1][startRowLine].char === 'L' ||
						realMap[j + 1][startRowLine].char === 'J'
					) {
						realMap[j + 1][startRowLine].char = 'S';
						hasFound90DegreeChar = true;
						break;
					}
				}
				break;
			}
		}
	}
};
makeStartPositionWorkable();

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

	const thisLine = realMap[currentLineIndex];
	const prevLine = realMap[currentLineIndex - 1];
	const nextLine = realMap[currentLineIndex + 1];

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

const findStart = realMap.flatMap((currentLine, currentLineIndex) => {
	let relevantPaths: Array<Tile> = [];

	currentLine.map((line) => {
		if (line.char === 'S') {
			line.status = 'part_of_main_loop';
			relevantPaths = findRelevantNextNewDirections(line, currentLineIndex, undefined);
		}
	});

	return relevantPaths;
});

const starting90DegreeChars = ['F', 'L', '7', 'J'];
const tempStarting90DegreeChars: string[] = [];
const findNextDirectionTile = (tiles: Tile[], relevantTile: Tile) => {
	const tempStartingFaceDirections: TileDirection[] = [];

	const foundTiles = tiles.filter((tile, index) => {
		const oppositeDir: { [key: string]: string } = {
			n: 's',
			s: 'n',
			e: 'w',
			w: 'e',
		};
		const alignDirToFaceMap: { [key: string]: string } = {
			s: 'd',
			n: 'u',
			w: 'l',
			e: 'r',
		};

		const directionJointWithStart = (direction: TileDirection) => {
			return (
				tile.matches.find((match) => oppositeDir[direction] === match) &&
				relevantTile.matches.includes(direction)
			);
		};
		const setFaceDirection = (direction: TileDirection) => {
			if (tile.status === 'part_of_main_loop' || relevantTile.status === 'part_of_main_loop') {
				if (relevantTile.char === 'S' && tile.status === 'part_of_main_loop') {
					tempStartingFaceDirections.push(direction);

					const relevantFaceStartingDirections =
						faceDirections[tempStartingFaceDirections.sort().join('')];

					if (tile.faceDirections.direction === 'unspecified') {
						tile.faceDirections.direction = direction;
						tile.faceDirections.face = faceDirections[tiles[index].matches.sort().join('')];
					}

					if (index === tiles.length - 1) {
						for (let i = 0; i < tiles.length; i++) {
							tiles[i].faceDirections.face =
								(tiles[i].faceDirections.face as TileFace[]).filter((f: TileFace) =>
									relevantFaceStartingDirections.includes(f)
								)[0] || alignDirToFaceMap[tiles[i].faceDirections.direction];

							if (starting90DegreeChars.some((char) => char === tiles[i].char)) {
								tempStarting90DegreeChars.push(tiles[i].char);
							}
						}
					}
				} else if (relevantTile.char !== 'S') {
					const setDirectionBasedOnSomeStartingTilesAre90Degree = (f: string) => {
						if (tempStarting90DegreeChars.length === 0) {
							return f === tile.matches.find((match) => oppositeDir[direction] === match);
						}

						return f !== tile.matches.find((match) => oppositeDir[direction] === match);
					};

					const dir: TileDirection = tile.matches.filter((f) =>
						setDirectionBasedOnSomeStartingTilesAre90Degree(f)
					)[0] as TileDirection;

					if (tile.faceDirections.direction === 'unspecified') {
						tile.faceDirections.direction = dir;
						tile.faceDirections.face = faceDirections[tiles[index].matches.sort().join('')];
					}

					if (tile.faceDirections.face && typeof tile.faceDirections.face !== 'string') {
						tile.faceDirections.face =
							tile.faceDirections.face[tile.matches.sort().findIndex((inx) => inx === dir)];

						if (tile.char === 'F' || tile.char === 'L' || tile.char === '7' || tile.char === 'J') {
							if (
								alignDirToFaceMap[tile.faceDirections.direction as TileDirection] ===
								relevantTile.faceDirections.face
							) {
								tile.faceDirections.face = relevantTile.faceDirections.face;
							}

							const substituteFace = (char: string, relevantChar: string, direction: TileFace) => {
								let subFace: { '|': 'unspecified' | TileFace; '-': 'unspecified' | TileFace } = {
									'|': 'unspecified',
									'-': 'unspecified',
								};
								if (relevantChar === '-' || relevantChar === '|') {
									switch (relevantChar) {
										case '-':
											switch (char) {
												case 'F':
													switch (direction) {
														case 'u':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'd':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
												case '7':
													switch (direction) {
														case 'u':
															subFace = { '|': 'r', '-': 'u' };
															break;
														case 'd':
															subFace = { '|': 'l', '-': 'd' };
															break;
													}
													break;
												case 'J':
													switch (direction) {
														case 'u':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'd':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
												case 'L':
													switch (direction) {
														case 'u':
															subFace = { '|': 'r', '-': 'u' };
															break;
														case 'd':
															subFace = { '|': 'l', '-': 'd' };
															break;
													}
											}
											break;
										case '|':
											switch (char) {
												case 'F':
													switch (direction) {
														case 'l':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'r':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
												case 'L':
													switch (direction) {
														case 'l':
															subFace = { '|': 'l', '-': 'd' };
															break;
														case 'r':
															subFace = { '|': 'r', '-': 'u' };
															break;
													}
													break;
												case '7':
													switch (direction) {
														case 'l':
															subFace = { '|': 'l', '-': 'd' };
															break;
														case 'r':
															subFace = { '|': 'r', '-': 'u' };
															break;
													}
													break;
												case 'J':
													switch (direction) {
														case 'l':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'r':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
											}
											break;
									}
								} else {
									switch (relevantChar) {
										case 'F':
											switch (char) {
												case 'L':
													switch (direction) {
														case 'd':
															subFace = { '|': 'r', '-': 'u' };
															break;
														case 'r':
															subFace = { '|': 'l', '-': 'd' };
															break;
													}
													break;
												case '7':
													switch (direction) {
														case 'r':
															subFace = { '|': 'r', '-': 'u' };
															break;
														case 'd':
															subFace = { '|': 'l', '-': 'd' };
															break;
													}
													break;
												case 'J':
													switch (direction) {
														case 'r':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'd':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
											}
											break;
										case 'L':
											switch (char) {
												case 'F':
													switch (direction) {
														case 'u':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'r':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
												case '7':
													switch (direction) {
														case 'u':
															subFace = { '|': 'l', '-': 'd' };
															break;
														case 'r':
															subFace = { '|': 'r', '-': 'u' };
															break;
													}
													break;
												case 'J':
													switch (direction) {
														case 'r':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'u':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
											}
											break;
										case '7':
											switch (char) {
												case 'F':
													switch (direction) {
														case 'l':
															subFace = { '|': 'r', '-': 'd' };
															break;
														case 'd':
															subFace = { '|': 'l', '-': 'u' };
															break;
													}

													break;
												case 'L':
													switch (direction) {
														case 'l':
															subFace = { '|': 'l', '-': 'd' };
															break;
														case 'd':
															subFace = { '|': 'r', '-': 'u' };
															break;
													}
													break;
												case 'J':
													switch (direction) {
														case 'd':
															subFace = { '|': 'r', '-': 'd' };
															break;
														case 'l':
															subFace = { '|': 'l', '-': 'u' };
															break;
													}
													break;
											}
											break;
										case 'J':
											switch (char) {
												case 'F':
													switch (direction) {
														case 'u':
															subFace = { '|': 'l', '-': 'u' };
															break;
														case 'l':
															subFace = { '|': 'r', '-': 'd' };
															break;
													}
													break;
												case '7':
													switch (direction) {
														case 'u':
															subFace = { '|': 'l', '-': 'd' };
															break;
														case 'l':
															subFace = { '|': 'r', '-': 'u' };
															break;
													}
													break;
												case 'L':
													switch (direction) {
														case 'l':
															subFace = { '|': 'l', '-': 'd' };
															break;
														case 'u':
															subFace = { '|': 'r', '-': 'u' };
															break;
													}
													break;
											}
											break;
									}
								}

								return subFace;
							};

							tile.faceDirections['90degreeFaces'] = substituteFace(
								tile.char,
								relevantTile.char,
								relevantTile.faceDirections.face as TileFace
							);
						}
					}
				}
			}
		};

		if (
			relevantTile.lineRowIndex < tile.lineRowIndex &&
			relevantTile.lineColIndex === tile.lineColIndex &&
			directionJointWithStart('s')
		) {
			setFaceDirection('s');
			return tile;
		} else if (
			relevantTile.lineRowIndex === tile.lineRowIndex &&
			relevantTile.lineColIndex > tile.lineColIndex &&
			directionJointWithStart('w')
		) {
			setFaceDirection('w');
			return tile;
		} else if (
			relevantTile.lineRowIndex === tile.lineRowIndex &&
			relevantTile.lineColIndex < tile.lineColIndex &&
			directionJointWithStart('e')
		) {
			setFaceDirection('e');
			return tile;
		} else if (
			relevantTile.lineRowIndex > tile.lineRowIndex &&
			relevantTile.lineColIndex === tile.lineColIndex &&
			directionJointWithStart('n')
		) {
			setFaceDirection('n');
			return tile;
		}
	});

	return foundTiles;
};

const findStartingDirectionTile = (tiles: Tile[]) => {
	const startingTile = tiles.filter((tile) => tile.char === 'S')[0];
	let foundStartingTiles = tiles.filter((tile) => tile.char !== 'S');

	foundStartingTiles = findNextDirectionTile(tiles, startingTile);

	for (let i = 0; i < foundStartingTiles.length; i++) {
		foundStartingTiles[i].status = 'part_of_main_loop';
		findNextDirectionTile(foundStartingTiles, startingTile);
	}

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
	nextRelevantDirectionTile.status = 'part_of_main_loop';

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

const encloseTiles = () => {
	const mainTiles = realMap.flatMap((map) =>
		map.filter((line) => line.status === 'part_of_main_loop' && line.char !== 'S')
	);
	let unspecifiedTiles = realMap.flatMap((map) =>
		map.filter((line) => line.status === 'unspecified')
	);

	for (let i = 0; i < mainTiles.length; i++) {
		const enclose = (tileFace: TileFace) => {
			switch (tileFace) {
				case 'u':
					unspecifiedTiles = unspecifiedTiles.map((tile) => {
						if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex - 1 &&
							tile.lineColIndex === mainTiles[i].lineColIndex
						) {
							tile.status = 'enclosed';
						} else if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex + 1 &&
							tile.lineColIndex === mainTiles[i].lineColIndex
						) {
							tile.status = 'not_enclosed';
						}
						return tile;
					});
					break;
				case 'd':
					unspecifiedTiles = unspecifiedTiles.map((tile) => {
						if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex + 1 &&
							tile.lineColIndex === mainTiles[i].lineColIndex
						) {
							tile.status = 'enclosed';
						} else if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex - 1 &&
							tile.lineColIndex === mainTiles[i].lineColIndex
						) {
							tile.status = 'not_enclosed';
						}
						return tile;
					});
					break;
				case 'l':
					unspecifiedTiles = unspecifiedTiles.map((tile) => {
						if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex &&
							tile.lineColIndex === mainTiles[i].lineColIndex - 1
						) {
							tile.status = 'enclosed';
						} else if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex &&
							tile.lineColIndex === mainTiles[i].lineColIndex + 1
						) {
							tile.status = 'not_enclosed';
						}
						return tile;
					});
					break;
				case 'r':
					unspecifiedTiles = unspecifiedTiles.map((tile) => {
						if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex &&
							tile.lineColIndex === mainTiles[i].lineColIndex + 1
						) {
							tile.status = 'enclosed';
						} else if (
							tile.lineRowIndex === mainTiles[i].lineRowIndex &&
							tile.lineColIndex === mainTiles[i].lineColIndex - 1
						) {
							tile.status = 'not_enclosed';
						}
						return tile;
					});
					break;
			}
		};

		if (mainTiles[i].faceDirections['90degreeFaces']) {
			const objToArrValues = Object.values(mainTiles[i].faceDirections['90degreeFaces']!);

			for (let j = 0; j < objToArrValues.length; j++) {
				enclose(objToArrValues[j] as TileFace);
			}
		} else {
			enclose(mainTiles[i].faceDirections.face as TileFace);
		}
	}

	unspecifiedTiles = unspecifiedTiles.filter((tile, tileIndex) => {
		if (
			unspecifiedTiles[tileIndex - 1]?.status === 'enclosed' &&
			unspecifiedTiles[tileIndex - 1]?.lineColIndex === tile.lineColIndex - 1 &&
			unspecifiedTiles[tileIndex + 1]?.status !== 'not_enclosed' &&
			unspecifiedTiles[tileIndex + 1]?.lineColIndex === tile.lineColIndex + 1
		) {
			tile.status = 'enclosed';
		}

		return tile;
	});

	enclosedNum = unspecifiedTiles.filter((tile) => tile.status === 'enclosed').length;
};

encloseTiles();

console.log((halfwayNum += count / 2));
console.log(enclosedNum);
