let totalValue = 0;

realData.forEach((line) => {
	let currentValue = 0;

	line.split('').forEach((char) => {
		currentValue += char.charCodeAt(0);
		currentValue = currentValue * 17;
		currentValue = currentValue % 256;
	});

	totalValue += currentValue;
});

console.log(totalValue);
