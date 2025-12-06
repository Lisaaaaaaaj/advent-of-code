// 1463677 too low
// 1490176 too high
// 1489629 too high

let workableData = [...realData].map((d) => {
	let dModified = d;

	dModified = dModified.replaceAll('#', '##');
	dModified = dModified.replaceAll('.', '..');
	dModified = dModified.replaceAll('O', '[]');
	dModified = dModified.replaceAll('@', '@.');

	return dModified;
});
const workableSteps = realDataSteps.split('');

const orderLines = (pattern: string[], searchType: 'vertical' | 'horizontal') => {
	const verticalLength = pattern[0].length;
	const horizontalLength = pattern.length;
	const searchLength = searchType === 'horizontal' ? horizontalLength : verticalLength;
	const searchLengthWithin = searchLength === horizontalLength ? verticalLength : horizontalLength;

	const lines: string[][] = [];

	for (let i = 0; i < searchLength; i++) {
		lines.push([]);

		for (let j = 0; j < searchLengthWithin; j++) {
			if (searchType === 'vertical') {
				lines[i].push(pattern[j].charAt(i));
			} else {
				lines[i].push(pattern[i].charAt(j));
			}
		}
	}

	return lines;
};

const swapChars = (arr: string[], from: number, to: number) => {
	const charArray = arr;

	if (charArray[to] === '#') {
		return charArray;
	}

	[charArray[from], charArray[to]] = [charArray[to], charArray[from]];

	return charArray;
};

const needNoFlip = (mapToFlip: string[]) =>
	mapToFlip.every((d, rowIndex) => {
		return d
			.split('')
			.every((dd, colIndex) => (dd === '#' ? workableData[rowIndex][colIndex] === '#' : true));
	});

const flipUntilMatchWorkableData = (mapToFlip: string[]) => {
	let stopFlippin = false;
	let goodMap = mapToFlip;

	while (!stopFlippin) {
		if (stopFlippin) {
			break;
		}

		let flippedMap = orderLines(
			orderLines(
				goodMap.reverse().map((f) => f),
				'horizontal'
			).map((f) => f.reverse().join('')),
			'vertical'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'vertical'
			).map((f) => f.join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'vertical'
			).map((f) => f.join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'horizontal'
			).map((f) => f.reverse().join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'vertical'
			).map((f) => f.reverse().join('')),
			'vertical'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'horizontal'
			).map((f) => f.join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}
	}

	return goodMap;
};

const tiltFloor = (lines: string[][], dir: string) => {
	const modifiedLines = [...lines];
	let movedLines: string[] = [];
	let hitWall = false;

	if (dir === '<' || dir === '>') {
		modifiedLines.forEach((line) => {
			const splittedLines = line
				.join('')
				.split(/(#)/g)
				.filter((sp) => sp.length);
			const groupedChunks = [...splittedLines.map((sp) => [...sp.matchAll(/@|(\[\])/g)])];

			const orderedFloor = [...splittedLines];

			groupedChunks.map((chunk, chunkIndex) => {
				let orderedChunks = '';

				chunk.map((ch) => {
					if (!orderedChunks.length) {
						orderedChunks = ch.input;
					}

					const chunkArrified = ch.input
						.split(/(\[\])/g)
						.filter((d) => d.length)
						.flatMap((d) => {
							if (d.split('').every((dd) => dd !== '[' && dd !== ']')) {
								return [...d.split('')];
							}

							return d;
						});

					const robotIndex = chunkArrified.indexOf('@');
					const boxIndexes: number[] = [];
					const dotIndex = chunkArrified.indexOf('.');

					if (robotIndex !== -1 && dotIndex !== -1 && dotIndex < robotIndex) {
						for (let i = 0; i < robotIndex; i++) {
							if (chunkArrified[i] === '[]') {
								boxIndexes.push(i);
							}
						}

						const relevantJoinedBoxes = boxIndexes
							.reverse()
							.filter((d, i) => robotIndex - i - 1 === d || false)
							.reverse();
						let swappedBoxes = chunkArrified;

						if (relevantJoinedBoxes.find((b) => b + 1 === robotIndex)) {
							relevantJoinedBoxes.forEach((box) => {
								swappedBoxes = swapChars(chunkArrified, box, box - 1);
							});
						}

						const movedRobot = swapChars(swappedBoxes, robotIndex, robotIndex - 1);

						orderedChunks = movedRobot.join('');
						orderedFloor[chunkIndex] = orderedChunks;
					}
				});
			});

			movedLines.push(orderedFloor.filter((sp) => sp.length).join(''));
		});
	} else {
		const lineIndex = modifiedLines.findIndex((d) => d.includes('@'));
		const line = modifiedLines[lineIndex];
		const robotIndex = modifiedLines[lineIndex].indexOf('@');

		const robotIndexChunk = modifiedLines[lineIndex].indexOf('@');
		const robotIndexDiff = line.indexOf('@') - robotIndexChunk;
		const boxIndexes = [];
		const dotIndex = modifiedLines[lineIndex].indexOf('.');

		if (robotIndex > -1 && dotIndex !== -1 && dotIndex < robotIndex) {
			if (modifiedLines[lineIndex][robotIndexChunk - 1] === ']') {
				boxIndexes.push({
					line: lineIndex,
					boxHalfIndex: robotIndexChunk + robotIndexDiff - 1,
					char: ']',
				});
				boxIndexes.push({
					line: lineIndex - 1,
					boxHalfIndex: robotIndexChunk + robotIndexDiff - 1,
					char: '[',
				});
			} else if (modifiedLines[lineIndex][robotIndexChunk - 1] === '[') {
				boxIndexes.push({
					line: lineIndex,
					boxHalfIndex: robotIndexChunk + robotIndexDiff - 1,
					char: '[',
				});
				boxIndexes.push({
					line: lineIndex + 1,
					boxHalfIndex: robotIndexChunk + robotIndexDiff - 1,
					char: ']',
				});
			}

			const allBoxIndexes = [...boxIndexes];
			const updatedAllBoxesIndexes = new Set([...boxIndexes].map((d) => JSON.stringify(d)));

			const lookForAllTheJoinedBoxes = () => {
				while (allBoxIndexes.length > 0) {
					const currentBoxIndex = allBoxIndexes.shift()!;
					const d = currentBoxIndex;

					const relevantLinesContentSameCol = modifiedLines[d.line][d.boxHalfIndex - 1];
					const boxesAreFullyOnTopOfEachOther = relevantLinesContentSameCol === d.char;

					const moveTheBoxesOnTopOfEachOther = () => {
						const selfBoxHalf = {
							line: d.line,
							boxHalfIndex: d.boxHalfIndex - 1,
							char: relevantLinesContentSameCol,
						};

						allBoxIndexes.push(selfBoxHalf);

						if (!updatedAllBoxesIndexes.has(JSON.stringify(selfBoxHalf))) {
							updatedAllBoxesIndexes.add(JSON.stringify(selfBoxHalf));
						}
					};

					const moveTheBoxesDiagonallyOnEachOther = (prevLine: boolean, otherChar: '[' | ']') => {
						const selfBoxHalf = {
							line: d.line,
							boxHalfIndex: d.boxHalfIndex - 1,
							char: relevantLinesContentSameCol,
						};
						const otherBoxHalf = {
							line: prevLine ? d.line - 1 : d.line + 1,
							boxHalfIndex: d.boxHalfIndex - 1,
							char: otherChar,
						};

						allBoxIndexes.push(selfBoxHalf);
						allBoxIndexes.push(otherBoxHalf);

						if (
							!updatedAllBoxesIndexes.has(JSON.stringify(selfBoxHalf)) &&
							!updatedAllBoxesIndexes.has(JSON.stringify(otherBoxHalf))
						) {
							updatedAllBoxesIndexes.add(JSON.stringify(selfBoxHalf));
							updatedAllBoxesIndexes.add(JSON.stringify(otherBoxHalf));
						}
					};

					if (d.char === '[') {
						if (relevantLinesContentSameCol === ']') {
							moveTheBoxesDiagonallyOnEachOther(true, '[');
						} else if (boxesAreFullyOnTopOfEachOther) {
							moveTheBoxesOnTopOfEachOther();
						}
					} else {
						if (boxesAreFullyOnTopOfEachOther) {
							moveTheBoxesOnTopOfEachOther();
						} else if (relevantLinesContentSameCol === '[') {
							moveTheBoxesDiagonallyOnEachOther(false, ']');
						}
					}
				}
			};
			lookForAllTheJoinedBoxes();

			const relevantJoinedBoxes = [...updatedAllBoxesIndexes]
				.map((d) => JSON.parse(d))
				.sort((a, b) => a.boxHalfIndex - b.boxHalfIndex);
			const updatedRelevantBoxes = new Map();

			if (
				relevantJoinedBoxes.find((d) => {
					return modifiedLines[d.line][d.boxHalfIndex - 1] === '#';
				})
			) {
				hitWall = true;
			} else if (!hitWall) {
				while (relevantJoinedBoxes.length > 0) {
					const currentRelevantBox = relevantJoinedBoxes.shift()!;
					const box = currentRelevantBox;

					const swapTheBox = swapChars(
						modifiedLines[box.line],
						box.boxHalfIndex,
						box.boxHalfIndex - 1
					);

					if (!updatedRelevantBoxes.has(box.line)) {
						updatedRelevantBoxes.set(box.line, swapTheBox);
					}
				}

				updatedRelevantBoxes.forEach((d) => {
					modifiedLines[d[0]] = d[1];
				});
			}
		}

		const afterMovingAllTheBoxesRobotCanWalk =
			modifiedLines[lineIndex][robotIndexChunk - 1] === '.';

		if (afterMovingAllTheBoxesRobotCanWalk) {
			const walkedRobot = swapChars(modifiedLines[lineIndex], robotIndex, robotIndex - 1);

			movedLines = modifiedLines.map((d) => d.join(''));
			movedLines[lineIndex] = walkedRobot.join('');
		} else {
			movedLines = modifiedLines.map((d) => d.join(''));
		}
	}

	return movedLines;
};

//let tempCount = 0;

const cycleFloor = (orderedFloor: string[], dir: string) => {
	// if (tempCount > 9000) {
	// 	console.log(dir)
	// 	console.log(tempCount)
	// 	console.log(workableData);
	// }
	if (dir === '^') {
		const orderedVerticalLines = orderLines(orderedFloor, 'vertical');
		const orderedFloorToNorth = tiltFloor([...orderedVerticalLines], dir);

		workableData = flipUntilMatchWorkableData(orderedFloorToNorth);
	} else if (dir === '>') {
		const orderedHorizontalLines = orderLines(orderedFloor, 'horizontal')
			.map((d) => {
				let dModified = d;

				dModified = dModified.map((dd) => dd.replaceAll('[', 'L'));
				dModified = dModified.map((dd) => dd.replaceAll(']', 'R'));

				return dModified;
			})
			.map((d) => d.reverse())
			.map((d) => {
				let dModified = d;

				dModified = dModified.map((dd) => dd.replaceAll('L', ']'));
				dModified = dModified.map((dd) => dd.replaceAll('R', '['));

				return dModified;
			});

		const orderedFloorToEast = tiltFloor([...orderedHorizontalLines], dir);

		workableData = flipUntilMatchWorkableData(
			orderedFloorToEast
				.map((d) => {
					let dModified = d;

					dModified = dModified.replaceAll('[', 'L');
					dModified = dModified.replaceAll(']', 'R');

					return dModified;
				})
				.reverse()
				.map((d) => {
					let dModified = d;

					dModified = dModified.replaceAll('L', ']');
					dModified = dModified.replaceAll('R', '[');

					return dModified;
				})
		);
	} else if (dir === 'v') {
		const orderedVerticalLines = orderLines(orderedFloor, 'vertical').map((d) => d.reverse());
		const orderedFloorToSouth = tiltFloor([...orderedVerticalLines], dir);

		workableData = flipUntilMatchWorkableData(orderedFloorToSouth);
	} else if (dir === '<') {
		const orderedHorizontalLines = orderLines(orderedFloor, 'horizontal');
		const orderedFloorToWest = tiltFloor([...orderedHorizontalLines], dir);

		workableData = orderedFloorToWest;
	}
};

while (workableSteps.length) {
	// tempCount += 1;
	// if (tempCount >= 10000) {
	// 	break;
	// }
	const currentDir = workableSteps.shift()!;

	cycleFloor(workableData, currentDir);
}

console.log(workableData);

const sumOfGPSCoords = workableData.reduce((acc, d, rowIndex) => {
	let num = 0;

	[...d.matchAll(/\[/g)].forEach((col) => {
		num += 100 * rowIndex + col.index;
	});

	return acc + num;
}, 0);

console.log(sumOfGPSCoords);
