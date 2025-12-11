let num = 0;

realData.map((card) => {
	const numbers = card.split(':')![1];

	const [winningNumbers, myNumbers] = numbers.split('|');
	const winningNumbersArray = winningNumbers.split(' ').filter((occ) => occ !== '');
	const myNumbersArray = myNumbers.split(' ').filter((occ) => occ !== '');

	let cardPoints = 0;

	myNumbersArray.map((str) => {
		if (winningNumbersArray.includes(str)) {
			if (cardPoints === 0) {
				cardPoints += 1;
			} else {
				cardPoints += cardPoints;
			}
		}
	});

	num += cardPoints;
});

console.log(num);
