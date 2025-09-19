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

[...mappedPatterns].forEach((pattern) => {
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
					totalPatternNotes += trackFromFoundStartLine + 1;
					foundVertical = true;
				} else {
					totalPatternNotes += (trackFromFoundStartLine + 1) * 100;
				}
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
				trackFromFoundStartLine + 2,
				trackFromFoundStartLine + 3,
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
});

console.log(totalPatternNotes);
