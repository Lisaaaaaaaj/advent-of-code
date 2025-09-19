let num = 0;

const getWaysToWin = () => {
	let iWin = 0;
	for (let i = 0; i < times.Time; i++) {
		if ((times.Time - i) * i > times.Distance) {
			iWin += 1;
		}
	}
	return iWin;
};

num = getWaysToWin();

console.log(num);
