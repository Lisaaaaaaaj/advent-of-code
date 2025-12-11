let totalValue = 0;

const boxes: [string, number][][] = new Array(256).fill([]);

const fillBoxesWithLenses = () => {
	realData.forEach((line) => {
		let relevantBox = 0;

		const splittedConcerns = line.split(/(=|-)/g).filter((s) => s.length);
		const label = splittedConcerns[0];
		const operation = splittedConcerns[1];
		const focalLength = parseInt(splittedConcerns[splittedConcerns.length - 1]);

		label.split('').forEach((char) => {
			relevantBox += char.charCodeAt(0);
			relevantBox = relevantBox * 17;
			relevantBox = relevantBox % 256;
		});

		if (boxes[relevantBox]) {
			const findRelevantBoxIndex =
				(boxes[relevantBox].length > -1 && boxes[relevantBox].findIndex(([l]) => l === label)) || 0;

			if (operation === '-' && findRelevantBoxIndex !== -1) {
				boxes[relevantBox].splice(findRelevantBoxIndex, 1);
			} else if (operation === '=') {
				if (findRelevantBoxIndex !== -1) {
					boxes[relevantBox][findRelevantBoxIndex] = [label, focalLength];
				} else if (findRelevantBoxIndex === -1) {
					boxes[relevantBox] = [...boxes[relevantBox], [label, focalLength]];
				}
			}
		}
	});
};
fillBoxesWithLenses();

const findFocusingPower = () => {
	boxes.forEach((box, boxIndex) => {
		const boxNumber = boxIndex + 1;

		box.forEach((b, index) => {
			const slot = index + 1;
			const focalLength = b[1];

			totalValue += boxNumber * slot * focalLength;
		});
	});
};
findFocusingPower();

console.log(totalValue);
