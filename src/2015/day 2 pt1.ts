const workableData = [...realData.split(/\n/)].map((d) => {
	const [l, w, h] = d.split(/x/);
	const slack = Math.min(
		parseInt(l, 10) * parseInt(w, 10),
		parseInt(w, 10) * parseInt(h, 10),
		parseInt(h, 10) * parseInt(l, 10)
	);

	return (
		2 * parseInt(l, 10) * parseInt(w, 10) +
		2 * parseInt(w, 10) * parseInt(h, 10) +
		2 * parseInt(h, 10) * parseInt(l, 10) +
		slack
	);
});

const totalWrappingPaper = workableData.reduce((acc, d) => acc + d, 0);

console.log(totalWrappingPaper);
