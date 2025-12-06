let numb = 0;

realData.map(val => {
	const allDigits = val?.match(/[0-9]/g);
	let firstDigit = allDigits![0];
	let lastDigit = allDigits![allDigits!.length - 1];

	let lolol = firstDigit + lastDigit;
	let lolnum = Number(lolol);

	// numb += lolnum;

	// ^ day one

	// beneath day 2

	let newArray = [];

	const firstDigitIndex = val.search(firstDigit);
	const lastDigitIndex = val.lastIndexOf(lastDigit);

	newArray[firstDigitIndex] = firstDigit;
	newArray[lastDigitIndex] = lastDigit;

	Object.entries({
		one: '1',
		two: '2',
		three: '3',
		four: '4',
		five: '5',
		six: '6',
		seven: '7',
		eight: '8',
		nine: '9',
	}).map(([key, value]) => {
		const regex = new RegExp(`${key}`, 'g');

		if (val.match(regex)) {
			const indexes = [];

			let indexOcc = val.indexOf(key, 0);

			while (indexOcc >= 0) {
				indexes.push(indexOcc);
				indexOcc = val.indexOf(key, indexOcc + 1);
			}

			indexes.map(well => {
				newArray[well!] = value;
			});
		}
	});

	newArray = newArray.filter(n => n);

	firstDigit = newArray![0];
	lastDigit = newArray![newArray!.length - 1];

	lolol = firstDigit + lastDigit;
	lolnum = Number(lolol);

	numb += lolnum;
});

console.log(numb);
