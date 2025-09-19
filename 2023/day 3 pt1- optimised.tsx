let num = 0;

realData.map(line => {
	const lineCollection = [{ num: '', lineColIndex: [] }];
	let lineCollectionIndex = 0;

	[...line].map((linePart, linePartIndex) => {
		const currentLinePartIsSymbol =
			!linePart?.match(/\./g) && !Number(linePart) && linePart !== '0';
		const currentLinePartIsNumber = Number(linePart) || linePart === '0';

		if (currentLinePartIsSymbol || currentLinePartIsNumber) {
			const nextLineIsNumber =
				!line[linePartIndex + 1]?.match(/\./g) &&
				(!!Number(line[linePartIndex + 1]) || line[linePartIndex + 1] === '0');

			lineCollection[lineCollectionIndex].num += linePart;
			lineCollection[lineCollectionIndex].lineColIndex.push(linePartIndex);

			if (
				currentLinePartIsSymbol ||
				(currentLinePartIsNumber && !nextLineIsNumber)
			) {
				lineCollection.push({ num: '', lineColIndex: [] });
				lineCollectionIndex += 1;
			}
		}
	});

	return lineCollection;
});

realData.map((currentLine, currentLineIndex) => {
	if (currentLineIndex > 0) {
		currentLine.map(line => {
			if (!line.num?.match(/\./g) && !Number(line.num) && line.num !== '0') {
				const currentSymbolIndex = line.lineColIndex[0];
				const currentSymbolIndexLeft = line.lineColIndex[0] - 1;
				const currentSymbolIndexRight = line.lineColIndex[0] + 1;

				const thisLine = realData[currentLineIndex];
				const prevLine = realData[currentLineIndex - 1];
				const nextLine = realData[currentLineIndex + 1];

				const pushAndFilterRelevantNum = (
					revLine: {
						num: string;
						lineColIndex: never[];
					}[]
				) => {
					return revLine
						.map(rvLine => {
							if (
								rvLine.lineColIndex.some(
									rvLineIndex =>
										Number(rvLine.num) &&
										(rvLineIndex === currentSymbolIndex ||
											rvLineIndex === currentSymbolIndexLeft ||
											rvLineIndex === currentSymbolIndexRight)
								)
							) {
								num += Number(rvLine.num);
								rvLine.num = '';
							}

							return rvLine;
						})
						.filter(line => line.num !== '');
				};

				realData[currentLineIndex - 1] = pushAndFilterRelevantNum(prevLine);

				realData[currentLineIndex] = pushAndFilterRelevantNum(thisLine);

				if (nextLine) {
					realData[currentLineIndex + 1] = pushAndFilterRelevantNum(nextLine);
				}
			}
		});
	}

	return currentLine;
});

console.log(num);
