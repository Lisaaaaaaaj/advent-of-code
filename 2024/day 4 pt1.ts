const workableData: string[][] = [...realData].map((d) => d.split(''));

const word = 'XMAS';
const numRows = workableData.length;
const numCols = workableData[0].length;

const directions = [
	[0, 1],
	[1, 0],
	[1, 1],
	[1, -1],
	[0, -1],
	[-1, 0],
	[-1, -1],
	[-1, 1],
];

const searchForXMAS = (
	grid: string[][],
	word: string,
	x: number,
	y: number,
	deltaX: number,
	deltaY: number
) => {
	for (let i = 0; i < word.length; i++) {
		const nextX = x + i * deltaX;
		const nextY = y + i * deltaY;
		const notOutOfBounds = nextX < 0 || nextY < 0 || nextX >= numRows || nextY >= numCols;

		if (notOutOfBounds || grid[nextY][nextX] !== word[i]) {
			return false;
		}
	}

	return true;
};

let foundXMAS = 0;

const findXMAS = (grid: string[][]) => {
	for (let x = 0; x < numRows; x++) {
		for (let y = 0; y < numCols; y++) {
			for (const [deltaX, deltaY] of directions) {
				if (searchForXMAS(grid, word, x, y, deltaX, deltaY)) {
					foundXMAS++;
				}
			}
		}
	}
};
findXMAS(workableData);

console.log(foundXMAS);
