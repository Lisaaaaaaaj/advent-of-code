const workableData = [...realData];

type HailStones = {
	startX: number;
	startY: number;
	startZ: number;
	velocityX: number;
	velocityY: number;
	velocityZ: number;
}[];
const hailstones: HailStones = [];

workableData
	.map((d) => d.replace('@', ',').split(','))
	.forEach((data) =>
		hailstones.push({
			startX: parseInt(data[0].trim()),
			startY: parseInt(data[1].trim()),
			startZ: parseInt(data[2].trim()),
			velocityX: parseInt(data[3].trim()),
			velocityY: parseInt(data[4].trim()),
			velocityZ: parseInt(data[5].trim()),
		})
	);

const gaussianElimination = (arrToElem: number[][]) => {
	for (let row = 0; row < arrToElem.length; row++) {
		const currElem = arrToElem[row][row];

		for (let col = 0; col < arrToElem[row].length; col++) {
			arrToElem[row][col] /= currElem;
		}

		for (let nextRow = 0; nextRow < arrToElem.length; nextRow++) {
			if (row === nextRow) {
				continue;
			}

			const factor = arrToElem[nextRow][row];

			for (let col = 0; col < arrToElem[nextRow].length; col++) {
				arrToElem[nextRow][col] -= factor * arrToElem[row][col];
			}
		}
	}

	return arrToElem.map((row) => row[row.length - 1]);
};

const throwRocksHehe = () => {
	const prependForGaussian = (slicedStones: HailStones, type: 'XY' | 'Z') => {
		return slicedStones
			.reduce((acc, currentValue, index, array) => {
				if (index < array.length - 1) {
					const h1 = currentValue;
					const h2 = array[index + 1];
					const flavours = {
						XY: [
							h2.velocityY - h1.velocityY,
							h1.velocityX - h2.velocityX,
							h1.startY - h2.startY,
							h2.startX - h1.startX,
							h1.startY * h1.velocityX +
								-h1.startX * h1.velocityY +
								-h2.startY * h2.velocityX +
								h2.startX * h2.velocityY,
						],
						Z: [
							h1.velocityX - h2.velocityX,
							h2.startX - h1.startX,
							h1.startZ * h1.velocityX -
								h1.startX * h1.velocityZ -
								h2.startZ * h2.velocityX +
								h2.startX * h2.velocityZ -
								(h2.velocityZ - h1.velocityZ) * rockX -
								(h1.startZ - h2.startZ) * rockDX,
						],
					};

					acc.push(flavours[type]);
				}

				return acc;
			}, [] as number[][])
			.map((item) => item.map((value) => Math.round(value)));
	};
	const [rockX, rockY, rockDX] = gaussianElimination(
		prependForGaussian(hailstones.slice(0, 5), 'XY')
	);
	const [rockZ] = gaussianElimination(prependForGaussian(hailstones.slice(0, 3), 'Z'));

	return [rockX, rockY, rockZ];
};
const [rockX, rockY, rockZ] = throwRocksHehe();

console.log(Math.round(rockX + rockY + rockZ));
