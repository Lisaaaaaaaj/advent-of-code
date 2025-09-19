let numb = 0;

realData.map((line, index) => {
	const gameLine = line.split(`Game ${index + 1}:`)[1].trim();

	const allSets = gameLine?.split(';');

	// 12 red, 13 green, 14 blue

	const checkAllSetsOk = allSets.map((set) => {
		const allSetLine = set?.split(',');

		const checkSetLineOk = allSetLine.map((setLine) => {
			let setLineIsOK = true;
			const map = {
				red: 12,
				green: 13,
				blue: 14,
			};
			const setLineNum = Number(setLine.trim().split(' ')[0]);
			const setLineWord = setLine.trim().split(' ')[1];

			if (setLineNum > map[setLineWord]) {
				setLineIsOK = false;
			}

			return setLineIsOK;
		});

		return checkSetLineOk.every((lineOk) => lineOk === true);
	});

	if (checkAllSetsOk.every((setsOk) => setsOk === true)) {
		console.log(checkAllSetsOk, allSets);

		console.log('GameOk', index);
		numb += index + 1;
	}
});

console.log(numb);