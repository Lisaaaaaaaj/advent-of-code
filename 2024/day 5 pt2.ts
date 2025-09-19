const workableDataRules = [...realDataRules.split(/\n/)]
	.map((d) => d.trim().split('|'))
	.filter((d) => d.length > 1)
	.map((d) => [parseInt(d[0], 10), parseInt(d[1], 10)]);
const workableDataUpdates = [...realDataUpdates.split(/\n/)]
	.map((d) => d.trim().split(/,/))
	.filter((d) => d.length > 1)
	.map((d) => d.map((dd) => parseInt(dd, 10)));

const findNotCorrectUpdatesInOrder = () => {
	const updatesInCorrectOrder = [];

	for (let i = 0; i < workableDataUpdates.length; i++) {
		const everyCorrect = [];

		for (let j = 0; j < workableDataUpdates[i].length; j++) {
			const relevantUpdateIndex = j;
			const relevantUpdate = workableDataUpdates[i][j];
			const relevantUpdateRules = workableDataRules.filter((d) => d.includes(relevantUpdate));

			const isCorrect = relevantUpdateRules.every((rule) => {
				if (rule[0] === relevantUpdate && workableDataUpdates[i].indexOf(rule[1]) !== -1) {
					return workableDataUpdates[i].indexOf(rule[1]) > relevantUpdateIndex;
				} else if (rule[1] === relevantUpdate && workableDataUpdates[i].indexOf(rule[0]) !== -1) {
					return workableDataUpdates[i].indexOf(rule[0]) < relevantUpdateIndex;
				}

				return true;
			});

			everyCorrect.push(isCorrect);
		}

		if (!everyCorrect.every((correct) => correct)) {
			updatesInCorrectOrder.push(workableDataUpdates[i]);
		}
	}

	return updatesInCorrectOrder;
};
const foundNotCorrectUpdatesInOrder = findNotCorrectUpdatesInOrder();

const reSortedUpdates = foundNotCorrectUpdatesInOrder.map((arr) => {
	arr.sort((a, b) => {
		const relevantUpdate = b;
		const relevantUpdateRules = workableDataRules.filter((d) => d.includes(relevantUpdate));
		let asExpected = 1;

		relevantUpdateRules.map((rule) => {
			if (rule[0] === b && rule[1] === a) {
				asExpected = 0;
			} else if (rule[0] === a && rule[1] === b) {
				asExpected = -1;
			}
		});

		return asExpected;
	});

	return arr;
});

const sumOfMiddlePageNumbers = reSortedUpdates.reduce(
	(acc, d) => acc + d[Math.floor(d.length / 2)],
	0
);

console.log(sumOfMiddlePageNumbers);
