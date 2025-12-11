const mappedPatterns: string[][] = [[]];
let totalPatternNotes = 0;

const splitPatterns = () => {
	let splitCount = 0;

	realData.forEach((data) => {
		if (!data.length) {
			splitCount += 1;
			mappedPatterns.push([]);
		} else {
			mappedPatterns[splitCount].push(data);
		}
	});
};
splitPatterns();

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

const findSmudge = (str1: string[], str2: string[]) => {
	let distance = 0;

	if (str1?.length === str2?.length) {
		for (let i = 0; i < str1?.length; i++) {
			if (str1[i] !== str2[i]) {
				distance += 1;
			}
		}

		return distance === 1;
	}

	return 0;
};

const originalReflections: Array<{ [key: string]: number }> = [];

[...mappedPatterns].forEach((pattern, patternIndex) => {
	const orderedVerticalLines = orderLines(pattern, 'vertical');
	const orderedHorizontalLines = orderLines(pattern, 'horizontal');

	let foundVertical = false;

	const searchForStart = (
		currVal: string[][],
		currIndex: number,
		nextIndex: number,
		trackFromFoundStartLine: number,
		searchType: 'vertical' | 'horizontal'
	) => {
		const outOfBounds = !currVal[nextIndex] || currIndex === -1;

		if (outOfBounds) {
			if (trackFromFoundStartLine !== -1) {
				if (searchType === 'vertical') {
					foundVertical = true;
				}
				originalReflections[patternIndex] = {
					[searchType]: trackFromFoundStartLine,
				};
			}

			return undefined;
		}

		const prevAndNextLinesMirror =
			JSON.stringify(currVal[currIndex]) === JSON.stringify(currVal[nextIndex]);
		const prevAndNextLinesDoesNotMirror =
			JSON.stringify(currVal[currIndex]) !== JSON.stringify(currVal[nextIndex]);
		const foundFirstTimeStartPos = trackFromFoundStartLine === -1 && prevAndNextLinesMirror;
		const hasFoundStartAndPrevAndNextLinesDoNotMirror =
			trackFromFoundStartLine > -1 && prevAndNextLinesDoesNotMirror;
		const hasNotFoundStartAndPrevAndNextLinesDoNotMirror =
			trackFromFoundStartLine === -1 && prevAndNextLinesDoesNotMirror;
		const hasFoundFirstTimeStartPosAndPrevAndNextLinesMirror =
			trackFromFoundStartLine > -1 && prevAndNextLinesMirror;

		if (foundFirstTimeStartPos) {
			searchForStart(currVal, currIndex - 1, nextIndex + 1, currIndex, searchType);
		} else if (hasFoundStartAndPrevAndNextLinesDoNotMirror) {
			searchForStart(
				currVal,
				trackFromFoundStartLine + 1,
				trackFromFoundStartLine + 2,
				-1,
				searchType
			);
		} else if (hasNotFoundStartAndPrevAndNextLinesDoNotMirror) {
			searchForStart(currVal, currIndex + 1, nextIndex + 1, trackFromFoundStartLine, searchType);
		} else if (hasFoundFirstTimeStartPosAndPrevAndNextLinesMirror) {
			searchForStart(currVal, currIndex - 1, nextIndex + 1, trackFromFoundStartLine, searchType);
		}
	};

	searchForStart(orderedVerticalLines, 0, 1, -1, 'vertical');

	if (!foundVertical) {
		searchForStart(orderedHorizontalLines, 0, 1, -1, 'horizontal');
	}

	foundVertical = false;

	const searchForSmudge = (
		currVal: string[][],
		currIndex: number,
		nextIndex: number,
		trackFromFoundStartLine: number,
		searchType: 'vertical' | 'horizontal'
	) => {
		const outOfBounds = !currVal[nextIndex] || currIndex === -1;

		if (outOfBounds) {
			if (trackFromFoundStartLine !== -1) {
				if (searchType === 'vertical') {
					totalPatternNotes += trackFromFoundStartLine + 1;
					foundVertical = true;
				} else {
					totalPatternNotes += (trackFromFoundStartLine + 1) * 100;
				}
			}

			return undefined;
		}

		const prevAndNextLinesMirror =
			JSON.stringify(currVal[currIndex]) === JSON.stringify(currVal[nextIndex]) ||
			findSmudge(currVal[currIndex], currVal[nextIndex]);
		const prevAndNextLinesDoesNotMirror =
			JSON.stringify(currVal[currIndex]) !== JSON.stringify(currVal[nextIndex]);
		const foundFirstTimeStartPos = trackFromFoundStartLine === -1 && prevAndNextLinesMirror;
		const hasFoundStartAndPrevAndNextLinesDoNotMirror =
			trackFromFoundStartLine > -1 && prevAndNextLinesDoesNotMirror;
		const hasNotFoundStartAndPrevAndNextLinesDoNotMirror =
			trackFromFoundStartLine === -1 && prevAndNextLinesDoesNotMirror;
		const hasFoundFirstTimeStartPosAndPrevAndNextLinesMirror =
			trackFromFoundStartLine > -1 && prevAndNextLinesMirror;

		if (currIndex !== originalReflections[patternIndex][searchType] && foundFirstTimeStartPos) {
			searchForSmudge(currVal, currIndex - 1, nextIndex + 1, currIndex, searchType);
		} else if (
			currIndex === originalReflections[patternIndex][searchType] &&
			foundFirstTimeStartPos
		) {
			searchForSmudge(currVal, currIndex + 1, nextIndex + 1, trackFromFoundStartLine, searchType);
		} else if (hasFoundStartAndPrevAndNextLinesDoNotMirror) {
			if (findSmudge(currVal[currIndex], currVal[nextIndex])) {
				searchForSmudge(currVal, currIndex - 1, nextIndex + 1, trackFromFoundStartLine, searchType);
			} else {
				searchForSmudge(
					currVal,
					trackFromFoundStartLine + 1,
					trackFromFoundStartLine + 2,
					-1,
					searchType
				);
			}
		} else if (hasNotFoundStartAndPrevAndNextLinesDoNotMirror) {
			searchForSmudge(currVal, currIndex + 1, nextIndex + 1, trackFromFoundStartLine, searchType);
		} else if (hasFoundFirstTimeStartPosAndPrevAndNextLinesMirror) {
			searchForSmudge(currVal, currIndex - 1, nextIndex + 1, trackFromFoundStartLine, searchType);
		}
	};

	searchForSmudge(orderedVerticalLines, 0, 1, -1, 'vertical');

	if (!foundVertical) {
		searchForSmudge(orderedHorizontalLines, 0, 1, -1, 'horizontal');
	}
});

console.log(totalPatternNotes);
