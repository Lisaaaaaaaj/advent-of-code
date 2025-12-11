let num = 1;

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

let currentNode = 'AAA';
let leftOrRight = splittedLeftOrRight[0];
let count = 1;

while (currentNode !== 'ZZZ') {
	let indexModified = count;

	if (indexModified === splittedLeftOrRight.length) {
		indexModified = 0;
	}

	const mapLeftOrRight = {
		L: 0,
		R: 1,
	};
	const nextNode = workableNodes[currentNode][mapLeftOrRight[leftOrRight]];

	if (nextNode === 'ZZZ') {
		break;
	}

	num += 1;

	currentNode = nextNode;
	leftOrRight = splittedLeftOrRight[indexModified];
	count = indexModified + 1;
}

console.log(num);
