const directions: { [key: string]: [number, number] } = {
	'^': [-1, 0],
	'>': [0, 1],
	v: [1, 0],
	'<': [0, -1],
};

const grid = new Array(4000).fill('.').map(() => new Array(4000).fill('.'));
let position = [grid.length / 2, grid.length / 2];
let positionSantaRobot = [grid.length / 2, grid.length / 2];

const visitedHouses = new Set();
visitedHouses.add(`${[grid.length / 2, grid.length / 2]}`);

const visitedHousesBySantaRobot = new Set();

[...realData.split('')].forEach((dir, index) => {
	if (index % 2 === 0) {
		const nextPos = [position[0] + directions[dir][0], position[1] + directions[dir][1]];

		visitedHouses.add(`${nextPos}`);
		position = nextPos;
	} else {
		const nextPos = [
			positionSantaRobot[0] + directions[dir][0],
			positionSantaRobot[1] + directions[dir][1],
		];

		visitedHousesBySantaRobot.add(`${nextPos}`);
		positionSantaRobot = nextPos;
	}
});

const uniqueVisitedHouses = new Set([...visitedHouses, ...visitedHousesBySantaRobot]);

const ans = uniqueVisitedHouses.size;

console.log(ans);
