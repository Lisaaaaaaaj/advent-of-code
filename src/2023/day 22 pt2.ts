const workableData = [...realData.split('\n\t')].filter((d) => d.length);

const sortedBricks = workableData
	.map((line) => line.replace(/~/g, ',').split(',').map(Number))
	.sort((a, b) => {
		const brickAZIndex = a[2];
		const brickBZIndex = b[2];

		return brickAZIndex - brickBZIndex;
	});

const compareBricks = (brickA: number[], brickB: number[]) => {
	const [xA, yA, _, xA2, yA2] = brickA;
	const [xB, yB, _2, xB2, yB2] = brickB;

	return Math.max(xA, xB) <= Math.min(xA2, xB2) && Math.max(yA, yB) <= Math.min(yA2, yB2);
};

const dropThemBricks = () => {
	for (let index = 0; index < sortedBricks.length; index++) {
		const brick = sortedBricks[index];
		let groundZIndex = 1;

		for (const brickToCompare of sortedBricks.slice(0, index)) {
			const zIndex = brickToCompare[5];

			if (compareBricks(brick, brickToCompare)) {
				groundZIndex = Math.max(groundZIndex, zIndex + 1);
			}
		}

		brick[5] -= brick[2] - groundZIndex;
		brick[2] = groundZIndex;
	}
};
dropThemBricks();

const supportSet: () => Set<number>[] = () =>
	Array.from({ length: sortedBricks.length }, () => new Set());
const supportingBricks: Set<number>[] = supportSet();
const supportedByBricks: Set<number>[] = supportSet();

const determineSupportingBricks = () => {
	for (let i = 0; i < sortedBricks.length; i++) {
		const nextBrick = sortedBricks[i];
		const nextZIndex = nextBrick[2];

		for (let j = 0; j < i; j++) {
			const prevBrick = sortedBricks[j];
			const prevZIndex = prevBrick[5];

			if (compareBricks(prevBrick, nextBrick) && nextZIndex === prevZIndex + 1) {
				supportingBricks[j].add(i);
				supportedByBricks[i].add(j);
			}
		}
	}
};
determineSupportingBricks();

const determineBricksToDisIntegrate = () => {
	let mayDisIntegrate = 0;

	for (let i = 0; i < sortedBricks.length; i++) {
		const bricksList = Array.from(supportingBricks[i]).filter(
			(j) => supportedByBricks[j].size === 1
		);
		const wouldFallList = new Set(bricksList);
		wouldFallList.add(i);

		while (bricksList.length > 0) {
			const currentBrick = bricksList.shift()!;

			for (const supportingBrick of Array.from(supportingBricks[currentBrick]).filter(
				(brick) => !wouldFallList.has(brick)
			)) {
				if (Array.from(supportedByBricks[supportingBrick]).every((b) => wouldFallList.has(b))) {
					bricksList.push(supportingBrick);
					wouldFallList.add(supportingBrick);
				}
			}
		}

		mayDisIntegrate += wouldFallList.size - 1;
	}

	return mayDisIntegrate;
};
const answer = determineBricksToDisIntegrate();

console.log(answer);
