const workableData = [...realData];

const blink = (times: number) => {
	const cache = new Map();

	const calc = (d: number, left: number) => {
		if (left === 0) {
			return 1;
		} else if (d === 0) {
			return calc(1, left - 1);
		} else if (cache.has(`${d},${left}`)) {
			return cache.get(`${d},${left}`);
		}

		const currNum = d.toString();
		let relevantNumber = 0;

		if (currNum.length % 2 === 0) {
			const first = parseInt(currNum.slice(0, currNum.length / 2));
			const second = parseInt(currNum.slice(currNum.length / 2));

			relevantNumber = calc(first, left - 1) + calc(second, left - 1);
		} else {
			relevantNumber = calc(d * 2024, left - 1);
		}

		cache.set(`${d},${left}`, relevantNumber);
		return relevantNumber;
	};

	return workableData.reduce((acc, d) => (acc += calc(d, times)), 0);
};

const manyStonesAfterBlinking = blink(75);

console.log(manyStonesAfterBlinking);
