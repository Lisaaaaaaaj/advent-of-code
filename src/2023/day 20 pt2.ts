type WorkableData = {
	ref: string;
	type: '#' | '&' | 'b';
	destModules: string[];
};
type WorkableDatas = {
	[key: string]: WorkableData;
};
const workableData: WorkableDatas = realData
	.split(/\n|\t/g)
	.filter((d) => d.length)
	.sort((a, b) => (a.indexOf('broadcaster') > b.indexOf('broadcaster') ? -1 : 0))
	.reduce((acc, d) => {
		const splittedData = d.split(' ').map((s) => s.replace(',', '').replace('%', '#'));
		const [module, _, ...destModules] = splittedData;
		const [type, ...ref] = module.split('');

		return {
			...acc,
			[ref.join('')]: {
				ref: ref.join(''),
				type,
				destModules,
			},
		};
	}, {});

type ParsedRelevantNode = { [key: string]: { id: number; val: number } };
const parsedRelevantNodes: { [key: string]: ParsedRelevantNode } = {};

const startBroadcaster = () => {
	const flipTheFlip = (ref: string, flipsToFlip: string[]) => {
		const onlyFlips = [...flipsToFlip].filter(
			(m) => workableData[m].type === '#' && workableData[m].ref !== ref
		);

		onlyFlips.forEach((flip) => {
			parsedRelevantNodes[ref][flip].val = 0;
		});
	};

	const walkBranches = (ref: string, currBranch: WorkableData, branchId: number) => {
		parsedRelevantNodes[ref] = {
			...parsedRelevantNodes[ref],
			[currBranch.ref]: { id: branchId, val: 1 },
		};

		if (
			currBranch.destModules.length === 1 &&
			workableData[currBranch.destModules[0]].type === '&'
		) {
			return flipTheFlip(ref, workableData[currBranch.destModules[0]].destModules);
		}

		const flipFlops = currBranch.destModules.filter((m) => workableData[m].type === '#');

		flipFlops.forEach((flip) => walkBranches(ref, workableData[flip], (branchId += 1)));
	};

	for (let i = 0; i < workableData['roadcaster'].destModules.length; i++) {
		const currDest = workableData[workableData['roadcaster'].destModules[i]];

		if (currDest) {
			parsedRelevantNodes[currDest.ref] = { [currDest.ref]: { id: 0, val: 1 } };

			if (currDest.destModules.length > 0) {
				const flipFlops = currDest.destModules.filter((m) => workableData[m].type === '#');

				flipFlops.forEach((flip) => walkBranches(currDest.ref, workableData[flip], 1));
			}
		} else {
			return workableData;
		}
	}
};
startBroadcaster();

type SortedParsedRelevantNode = number[][];
const sortedParsedRelevantModules: SortedParsedRelevantNode = Object.values(
	parsedRelevantNodes
).reduce(
	(acc: SortedParsedRelevantNode, nodes) => [...acc, Object.values(nodes).map((node) => node.val)],
	[]
);
const nodesToString = sortedParsedRelevantModules.map((node) => node.reverse().join(''));
const nodesReadyForLCM = Object.values(nodesToString).map((a) => Number(`0b${a}`));

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const answer = nodesReadyForLCM.reduce(lcm);
console.log(answer);
