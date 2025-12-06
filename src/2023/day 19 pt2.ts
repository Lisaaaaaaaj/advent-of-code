type WorkableWorkFlows = { [key: string]: string[] };
const workableWorkflows: WorkableWorkFlows = [...realWorkFlows].reduce((acc, node) => {
	const [parentNode, condition] = node.split(/{/);
	const splittedConditions = condition.replace(/}/g, '').split(/,/);

	return { ...acc, [parentNode]: splittedConditions };
}, {});

type Range = { [key: string]: [number, number] };
const range: Range = {
	x: [1, 4000],
	m: [1, 4000],
	a: [1, 4000],
	s: [1, 4000],
};

const getAcceptedRatings = (workflows: WorkableWorkFlows, flow: string, range: Range) => {
	const currentNode = workflows[flow];
	const acceptedRanges: Range[] = [];
	const nextRange = (r: Range) => JSON.parse(JSON.stringify(r));

	if (flow === 'A') {
		return [nextRange(range)];
	} else if (flow === 'R') {
		return [];
	}

	for (let node = 0; node < currentNode.length; node++) {
		const inputCond = currentNode[node].split(/(<|>)/);
		const rangeIsAccepted = (nextFlow: string, nextRange: Range) => {
			acceptedRanges.push(...getAcceptedRatings(workflows, nextFlow, nextRange));
		};

		if (inputCond.length > 1) {
			const [category, smallerOrGreater] = inputCond;
			const [resultToCheckAgainst, nextFlow] = inputCond[inputCond.length - 1].split(/:/);
			const seekNextRange = (smallerOrGreater: '<' | '>') => {
				const newRange = nextRange(range);
				const splitRanges = {
					'<': [1, 0, -1],
					'>': [0, 1, 1],
				};

				newRange[category][splitRanges[smallerOrGreater][0]] =
					parseInt(resultToCheckAgainst, 10) + splitRanges[smallerOrGreater][2];
				range[category][splitRanges[smallerOrGreater][1]] = parseInt(resultToCheckAgainst, 10);

				rangeIsAccepted(nextFlow, newRange);
			};

			switch (smallerOrGreater) {
				case '<':
					seekNextRange('<');
					break;
				case '>':
					seekNextRange('>');
					break;
			}
		} else {
			rangeIsAccepted(inputCond[0], nextRange(range));
		}
	}

	return acceptedRanges;
};

const acceptedRatings: Range[] = getAcceptedRatings(workableWorkflows, 'in', range);

const totalRangesSum = acceptedRatings
	.map((range) => Object.values(range).reduce((acc, range) => acc * (range[1] - range[0] + 1), 1))
	.reduce((acc, val) => acc + val, 0);

console.log(totalRangesSum);
