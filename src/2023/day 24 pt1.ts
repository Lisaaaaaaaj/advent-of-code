const dummyDataMinPos = 7;
const dummyDataMaxPos = 27;
const realDataMinPos = 200000000000000;
const realDataMaxPos = 400000000000000;

const minPos = realDataMinPos;
const maxPos = realDataMaxPos;

const workableData = [...realData];

const hailstones: {
	a: number;
	b: number;
	c: number;
	startX: number;
	startY: number;
	startZ: number;
	velocityX: number;
	velocityY: number;
	velocityZ: number;
}[] = [];

workableData
	.map((d) => d.replace('@', ',').split(','))
	.forEach((data) =>
		hailstones.push({
			a: parseInt(data[4].trim()),
			b: -parseInt(data[3].trim()),
			c:
				parseInt(data[4].trim()) * parseInt(data[0].trim()) -
				parseInt(data[3].trim()) * parseInt(data[1].trim()),
			startX: parseInt(data[0].trim()),
			startY: parseInt(data[1].trim()),
			startZ: parseInt(data[2].trim()),
			velocityX: parseInt(data[3].trim()),
			velocityY: parseInt(data[4].trim()),
			velocityZ: parseInt(data[5].trim()),
		})
	);

let total = 0;

const lookForIntersections = () => {
	for (let i = 0; i < hailstones.length; i++) {
		const hailstone = hailstones[i];

		for (const nextHailstone of hailstones.slice(0, i)) {
			const a1 = hailstone.a;
			const b1 = hailstone.b;
			const c1 = hailstone.c;
			const a2 = nextHailstone.a;
			const b2 = nextHailstone.b;
			const c2 = nextHailstone.c;
			const linesAreParallel = a1 * b2 === b1 * a2;

			if (linesAreParallel) {
				continue;
			}

			const x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
			const y = (c2 * a1 - c1 * a2) / (a1 * b2 - a2 * b1);

			if (x >= minPos && x <= maxPos && y >= minPos && y <= maxPos) {
				if (
					[hailstone, nextHailstone].every(
						(hailstone) =>
							(x - hailstone.startX) * hailstone.velocityX >= 0 &&
							(y - hailstone.startY) * hailstone.velocityY >= 0
					)
				) {
					total += 1;
				}
			}
		}
	}
};
lookForIntersections();

console.log(total);
