type WorkableWorkFlows = { [key: string]: string[] };
const workableWorkflows: WorkableWorkFlows = [...realWorkFlows].reduce((acc, node) => {
	const [parentNode, condition] = node.split(/{/);
	const splittedConditions = condition.replace(/}/g, '').split(/,/);

	return { ...acc, [parentNode]: splittedConditions };
}, {});

type WorkableRating = { [key: string]: number };
type WorkableRatings = WorkableRating[];
const workableRatings: WorkableRatings = [...realRatings].reduce((acc: WorkableRatings, node) => {
	const splittedRatings: WorkableRating = node
		.replace(/{|}/g, '')
		.split(/,/)
		.reduce((acc2, node2) => {
			const [category, number] = node2.split(/=/);

			return { ...acc2, [category]: parseInt(number, 10) };
		}, {});

	return [...acc, splittedRatings];
}, []);

const getAcceptedRatings = () => {
	let currentNode = workableWorkflows['in'];
	let ratingCount = 0;
	let theEnd = false;
	const acceptedRatings: WorkableRatings = [];

	while (!theEnd) {
		const currentWorkableRating = workableRatings[ratingCount];

		for (let node = 0; node < currentNode.length; node++) {
			if (!currentWorkableRating) {
				theEnd = true;
				break;
			}
			const inputCond = currentNode[node].split(/(<|>)/);
			const seekNextMove = (nextFlow: string) => {
				if (['A', 'R'].includes(nextFlow)) {
					if (nextFlow === 'A') {
						acceptedRatings.push(currentWorkableRating);
					}
					currentNode = workableWorkflows['in'];
					ratingCount++;
				} else {
					currentNode = workableWorkflows[nextFlow];
				}
			};

			if (inputCond.length > 1) {
				const [category, smallerOrGreater] = inputCond;
				const [resultToCheckAgainst, nextFlow] = inputCond[inputCond.length - 1].split(/:/);
				const relevantRating = currentWorkableRating[category];

				const resultIsSmallerIndeed =
					smallerOrGreater === '<' && relevantRating < parseInt(resultToCheckAgainst, 10);
				const resultIsGreaterIndeed =
					smallerOrGreater === '>' && relevantRating > parseInt(resultToCheckAgainst, 10);

				if (resultIsSmallerIndeed || resultIsGreaterIndeed) {
					seekNextMove(nextFlow);
					break;
				}
			} else {
				seekNextMove(inputCond[0]);
				break;
			}
		}
	}

	return acceptedRatings;
};
const acceptedRatings = getAcceptedRatings();

const totalRatingSum = acceptedRatings?.reduce((acc, rating) => {
	let sum = acc;

	Object.values(rating).forEach((r) => (sum += r));

	return sum;
}, 0);

console.log(totalRatingSum);
