const workableData: string[][] = [...realData].map((d) => d.split(''));

const numRows = workableData.length;
const numCols = workableData[0].length;

let foundMAS = 0;

const findMAS = (grid: string[][]) => {
	for (let x = 1; x < numRows - 1; x++) {
		for (let y = 1; y < numCols - 1; y++) {
			const centerChar = 'A';

			if (grid[x][y] === centerChar) {
				const topLeftBottomRight =
					(grid[x - 1][y - 1] === 'M' && grid[x + 1][y + 1] === 'S') ||
					(grid[x - 1][y - 1] === 'S' && grid[x + 1][y + 1] === 'M');
				const topRightBottomLeft =
					(grid[x - 1][y + 1] === 'M' && grid[x + 1][y - 1] === 'S') ||
					(grid[x - 1][y + 1] === 'S' && grid[x + 1][y - 1] === 'M');

				if (topLeftBottomRight && topRightBottomLeft) {
					foundMAS++;
				}
			}
		}
	}
};
findMAS(workableData);

console.log(foundMAS);
