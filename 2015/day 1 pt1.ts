let floorCount = 0;

[...realData.trim().split('')].forEach((dir) => {
	if (dir === '(') {
		floorCount += 1;
	} else {
		floorCount -= 1;
	}
});

console.log(floorCount);
