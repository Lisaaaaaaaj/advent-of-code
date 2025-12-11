let floorCount = 0;
let firsttimeBasementPosition = 0;
let foundIt = false;

[...realData.trim().split('')].map((dir, index) => {
	if (dir === '(') {
		floorCount += 1;
	} else {
		floorCount -= 1;
	}
	if (floorCount === -1 && !foundIt) {
		firsttimeBasementPosition = index + 1;
		foundIt = true;
		return;
	}
});

console.log(firsttimeBasementPosition);
