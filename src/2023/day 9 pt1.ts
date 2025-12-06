let num = 0;

let workableHistories = histories
	.split(/\n/)
	.filter((filt) => filt !== '')
	.map((node) => {
		const nodeToArray = node.split(' ').map((node) => Number(node));
		const historyObj = { history: 0, list: [nodeToArray] };

		for (let i = 0; i < historyObj.list.length; i++) {
			const tempArr = [];
			const tempDiff = [];
			for (let j = 1; j < historyObj.list[i].length; j++) {
				const diff = historyObj.list[i][j] - historyObj.list[i][j - 1];
				tempDiff.push(diff);
				tempArr.push(diff);
			}

			if (tempDiff.every((diff) => diff === 0)) {
				break;
			}

			if (tempArr.length > 0) {
				historyObj.list.push(tempArr);
			}
		}

		return historyObj;
	});

workableHistories = workableHistories.map((history) => {
	const { list } = history;
	let historyModified = 0;

	for (let i = 0; i < list.length; i++) {
		historyModified += list[i].slice(-1)[0];
	}

	return { history: historyModified, list: history.list };
});

console.log(workableHistories);
num = workableHistories.reduce((total, item) => total + item.history, 0);
console.log(num);
