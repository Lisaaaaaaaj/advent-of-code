let numb = 0;

realData.map((line, index) => {
	const gameLine = line.split(`Game ${index + 1}:`)[1].trim();

	const allSets = gameLine?.split(';');

	// 12 red, 13 green, 14 blue

	const setHighestRedBlueGreenNum = {
		red: 0,
		green: 0,
		blue: 0,
	};

	allSets.map(set => {
		const allSetLine = set?.split(',');

		allSetLine.map(setLine => {
			const setLineNum = Number(setLine.trim().split(' ')[0]);
			const setLineWord = setLine.trim().split(' ')[1];

			if (setLineNum > setHighestRedBlueGreenNum[setLineWord]) {
				setHighestRedBlueGreenNum[setLineWord] = setLineNum;
			}
		});
	});

	console.log(setHighestRedBlueGreenNum);

	numb +=
		setHighestRedBlueGreenNum['red'] *
		setHighestRedBlueGreenNum['green'] *
		setHighestRedBlueGreenNum['blue'];
});

console.log(numb);
