const mappedData: [string, number, string][] = [...realData]
	.map((d) => d.split(' '))
	.map((d) => [d[0], parseInt(d[1]), d[2]]);

const calcAreaOfTrench = (vecticles: [number, number][]) => {
	const numberOfVertices = vecticles.length;
	let sum1 = 0;
	let sum2 = 0;

	for (let i = 0; i < numberOfVertices - 1; i++) {
		sum1 += vecticles[i][0] * vecticles[i + 1][1];
		sum2 += vecticles[i][1] * vecticles[i + 1][0];
	}

	sum1 += vecticles[numberOfVertices - 1][0] * vecticles[0][1];
	sum2 += vecticles[0][0] * vecticles[numberOfVertices - 1][1];

	return Math.abs(sum1 - sum2) / 2;
};

const calcVectors = () => {
	const vectors: [number, number][] = [[0, 0]];
	let steppy = 0;

	mappedData.forEach((d) => {
		const [dir, steps] = d;
		const currPoint = vectors[vectors.length - 1];

		steppy += steps;

		if (['L', 'R'].includes(dir)) {
			vectors.push(
				dir === 'L' ? [currPoint[0], currPoint[1] - steps] : [currPoint[0], currPoint[1] + steps]
			);
		}
		if (['U', 'D'].includes(dir)) {
			vectors.push(
				dir === 'U' ? [currPoint[0] - steps, currPoint[1]] : [currPoint[0] + steps, currPoint[1]]
			);
		}
	});

	return { vectors, steppy };
};
const { vectors, steppy } = calcVectors();
const trenchArea = calcAreaOfTrench(vectors) - steppy / 2 + 1 + steppy;

console.log(trenchArea);
