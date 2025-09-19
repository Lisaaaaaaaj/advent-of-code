let num = 0;

realData.map((card, index) => {
	const numbers = card.split(':')[1];

	const [winningNumbers, myNumbers] = numbers.split('|');
	const winningNumbersArray = winningNumbers.split(' ').filter((occ) => occ !== '');
	const myNumbersArray = myNumbers.split(' ').filter((occ) => occ !== '');

	let relevantNumbers: string[] | number[] = myNumbersArray.filter((str) => {
		if (winningNumbersArray.includes(str)) {
			return str;
		}
	});

	relevantNumbers = relevantNumbers.map((_, relIndex) => {
		return index + 1 + relIndex;
	});

	return {
		relevantNumbers,
		cardNumber: index + 1,
	};
});

const totalCards: number[] = [];

for (let i = 0; i < realData.length; i++) {
	if (realData[i].relevantNumbers) {
		realData[i].relevantNumbers.forEach((realDataIndex) => {
			realData.push(realData[realDataIndex]);
		});
	}

	if (totalCards[realData[i].cardNumber - 1] === undefined) {
		totalCards[realData[i].cardNumber - 1] = 0;
	}

	totalCards[realData[i].cardNumber - 1] += 1;
}

for (let i = 0; i < totalCards.length; i++) {
	num += totalCards[i];
}

console.log(num);
