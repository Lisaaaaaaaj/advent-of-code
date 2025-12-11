const dummyDataMaxXPosition = 11;
const dummyDataMaxYPosition = 7;
const realDataMaxXPosition = 101;
const realDataMaxYPosition = 103;

const workableMaxXPosition = realDataMaxXPosition;
const workableMaxYPosition = realDataMaxYPosition;

const workableData: {
	position: [number, number];
	velocity: [number, number];
}[] = [...realData].map((d) => {
	const [position, velocity] = d.split(' ');
	const [column, row] = position.split('=')[1].split(',');
	const [x, y] = velocity.split('=')[1].split(',');

	return {
		position: [parseInt(column, 10), parseInt(row, 10)],
		velocity: [parseInt(x, 10), parseInt(y, 10)],
	};
});

const maxPositionX = workableMaxXPosition - 1;
const maxPositionY = workableMaxYPosition - 1;

const halfOfXLinePos = maxPositionX / 2;
const halfOfYLinePos = maxPositionY / 2;

const nextPosition = (position: [number, number], velocity: [number, number]): [number, number] => {
	return [position[0] + velocity[0], position[1] + velocity[1]];
};

const teleportXMin = (robot: number) => {
	if (workableData[robot].position[0] < 0) {
		const restPosition = workableData[robot].position[0] + 1;

		workableData[robot].position[0] = maxPositionX + restPosition;
	}
};

const teleportXPlus = (robot: number) => {
	if (workableData[robot].position[0] > maxPositionX) {
		const restPosition = Math.abs(workableData[robot].position[0] - 1 - maxPositionX);

		workableData[robot].position[0] = 0 + restPosition;
	}
};

const teleportYMin = (robot: number) => {
	if (workableData[robot].position[1] < 0) {
		const restPosition = 0 - workableData[robot].position[1] - 1;

		workableData[robot].position[1] = maxPositionY - restPosition;
	}
};

const teleportYPlus = (robot: number) => {
	if (workableData[robot].position[1] > maxPositionY) {
		const restPosition = workableData[robot].position[1] - 1 - maxPositionY;

		workableData[robot].position[1] = 0 + restPosition;
	}
};

const walkXPlusYMin = (robot: number) => {
	teleportXPlus(robot);
	teleportYMin(robot);
};

const walkXMinYPlus = (robot: number) => {
	teleportXMin(robot);
	teleportYPlus(robot);
};

const walkXminYMin = (robot: number) => {
	teleportXMin(robot);
	teleportYMin(robot);
};

const walkXPlusYPlus = (robot: number) => {
	teleportXPlus(robot);
	teleportYPlus(robot);
};

const walk = (robot: number) => {
	for (let i = 0; i < 1; i++) {
		workableData[robot].position = nextPosition(
			workableData[robot].position,
			workableData[robot].velocity
		);

		if (workableData[robot].velocity[0] > 0 && workableData[robot].velocity[1] < 0) {
			walkXPlusYMin(robot);
		} else if (workableData[robot].velocity[0] < 0 && workableData[robot].velocity[1] > 0) {
			walkXMinYPlus(robot);
		} else if (workableData[robot].velocity[0] < 0 && workableData[robot].velocity[1] < 0) {
			walkXminYMin(robot);
		} else if (workableData[robot].velocity[0] > 0 && workableData[robot].velocity[1] > 0) {
			walkXPlusYPlus(robot);
		}
	}
};

const walkTheRobots = () => {
	let keepWalking = true;
	let count = 0;

	while (keepWalking) {
		count += 1;

		for (let i = 0; i < workableData.length; i++) {
			walk(i);
		}

		const filteredRobots = workableData.filter(
			(d) => d.position[0] !== halfOfXLinePos && d.position[1] !== halfOfYLinePos
		);

		const clusterA = filteredRobots.filter(
			(r) => r.position[0] < halfOfXLinePos && r.position[1] < halfOfYLinePos
		);
		const clusterB = filteredRobots.filter(
			(r) => r.position[0] > halfOfXLinePos && r.position[1] < halfOfYLinePos
		);
		const clusterC = filteredRobots.filter(
			(r) => r.position[0] > halfOfXLinePos && r.position[1] > halfOfYLinePos
		);
		const clusterD = filteredRobots.filter(
			(r) => r.position[0] < halfOfXLinePos && r.position[1] > halfOfYLinePos
		);

		console.log(clusterA, clusterB, clusterC, clusterD);

		if (
			clusterA.length >= 300 ||
			clusterB.length >= 300 ||
			clusterC.length >= 300 ||
			clusterD.length >= 300
		) {
			keepWalking = false;
		}
	}

	return count;
};

const stepsToDisplayEasterEgg = walkTheRobots();

console.log(stepsToDisplayEasterEgg);
