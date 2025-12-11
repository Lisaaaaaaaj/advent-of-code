const workableData = [...realData];

const blink = (times: number) => {
	let relevantStones: number[] = [];
	let blinkCount = 0;
	let currentStones = [...workableData];

	while (blinkCount < times + 1) {
		blinkCount += 1;

		relevantStones = [];

		if (blinkCount === times + 1) {
			break;
		} else {
			currentStones.forEach((d) => {
				const ds = d.toString();

				if (d === 0) {
					relevantStones.push(1);
				} else if (ds.length % 2 === 0) {
					const newStone = ds.slice(0, ds.length / 2);
					const secondNewStone = ds.slice(ds.length / 2, ds.length);

					relevantStones.push(parseInt(newStone, 10));
					relevantStones.push(parseInt(secondNewStone, 10));
				} else {
					relevantStones.push(d * 2024);
				}
			});

			currentStones = [...relevantStones];
		}
	}

	return currentStones;
};

const manyStonesAfterBlinking = blink(25).length;

console.log(manyStonesAfterBlinking);
