let num = 0;

const workableNodes: Record<string, string[]> = nodes
	.split(/\n/)
	.filter((filt) => filt !== '')
	.reduce((acc, node) => {
		const [parentNode, leftOrRightNodes] = node.split(/ = /);
		const leftOrRightNodesModified = leftOrRightNodes.replace(/[( ]/g, '').replace(/[ )]/g, '');
		const leftOrRightToArray = leftOrRightNodesModified.split(/,/);

		return { ...acc, [parentNode]: leftOrRightToArray };
	}, {});

const splittedLeftOrRight = map.split('');
const currentNodes = Object.keys(workableNodes).filter((wn) => wn.split('')[2] === 'A');
const nextNodes: string[] = currentNodes;
const zNodeList: number[] = [];

for (let i = 0; i < nextNodes.length; i++) {
	let leftOrRight = splittedLeftOrRight[0];
	let lrCount = 1;
	let distance = 0;

	do {
		let leftRightIndex = lrCount;
		if (leftRightIndex === splittedLeftOrRight.length) {
			leftRightIndex = 0;
		}

		const mapLeftOrRight: { [key: string]: number } = {
			L: 0,
			R: 1,
		};

		nextNodes[i] = workableNodes[currentNodes[i]][mapLeftOrRight[leftOrRight]];
		leftOrRight = splittedLeftOrRight[leftRightIndex];
		lrCount = leftRightIndex + 1;

		distance += 1;
		zNodeList[i] = distance;
	} while (nextNodes[i].split('')[2] !== 'Z');
}

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

num = zNodeList.reduce(lcm);

console.log(num);
