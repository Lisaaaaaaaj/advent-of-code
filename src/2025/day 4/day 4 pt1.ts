import {realData} from "./input.ts";
const workableData: string[][] = [...realData].map((d) => d.split(''));

const word = '@';
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

const searchForRollsOfPaper = (
	grid: string[][],
	word: string,
	x: number,
	y: number,
	deltaX: number,
	deltaY: number
) => {
    const nextX = x + 1 * deltaX;
    const nextY = y + 1 * deltaY;
    const notOutOfBounds = nextX < 0 || nextY < 0 || nextX >= numRows || nextY >= numCols;

    if (notOutOfBounds || grid[nextY][nextX] !== word) {
        return false;
    }

	return true;
};

let foundAccessableRollsOfPaper = 0;

const findAccessableRollsOfPaper = (grid: string[][]) => {
	for (let x = 0; x < numRows; x++) {
		for (let y = 0; y < numCols; y++) {
            let foundRollsOfPaper = 0;

            if (grid[y][x] !== word) {
                continue;
            }

			for (const [deltaX, deltaY] of directions) {
				if (searchForRollsOfPaper(grid, word, x, y, deltaX, deltaY)) {
					foundRollsOfPaper++;
				}
			}

            if (foundRollsOfPaper < 4) {
                foundAccessableRollsOfPaper++
            }
		}
	}
};
findAccessableRollsOfPaper(workableData);

console.log(foundAccessableRollsOfPaper);
