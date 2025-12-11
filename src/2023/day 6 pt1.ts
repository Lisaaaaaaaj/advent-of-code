let num = 0;

const getWaysToWin = times.Time.map((t, index) => {
	let iWin = 0;
	for (let i = 0; i < t; i++) {
		if ((t - i) * i > times.Distance[index]) {
			iWin += 1;
		}
	}
	return iWin;
}).reduce((a, b) => a * b, 1);

num = getWaysToWin;

console.log(num);
