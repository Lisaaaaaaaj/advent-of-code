const groupData = () => {
	const workableData: [number, number][][] = [[]];

	[...realData.split(/\n\t/)].forEach((d) => {
		const [d1, d2] = d
			.trim()
			.match(/[0-9]+/g)!
			.map((dd) => parseInt(dd, 10));
		const buttonType = d.trim().match(/A|B/g) ? d.trim().match(/A|B/g)![1] : null;

		if (buttonType) {
			workableData[workableData.length - 1].push([d1, d2]);
		} else {
			workableData[workableData.length - 1].push([d1, d2]);
			workableData.push([]);
		}
	});

	return workableData.filter((d) => d.length);
};

let total = 0;

const groupedData = groupData();

groupedData.forEach((d) => {
	const [ax, ay, bx, by, px, py] = [...d[0], ...d[1], ...d[2]];

	const lol = 10000000000000;
	const pxModified = px + lol;
	const pyModified = py + lol;

	const buttonAPress = (pxModified * by - pyModified * bx) / (ax * by - ay * bx);
	const buttonBPress = (pxModified - ax * ca) / bx;

	if (buttonAPress % 1 === 0 && buttonBPress % 1 === 0) {
		total += Math.floor(buttonAPress * 3 + buttonBPress);
	}
});

console.log(groupedData);
console.log(total);
