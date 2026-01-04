const workableData = [...realData.split(/\n/)].map((d) => {
	const [l, w, h] = d.split(/x/);
	const bow = parseInt(l, 10) * parseInt(w, 10) * parseInt(h, 10);
	const smallestPerimeter = [parseInt(l, 10), parseInt(w, 10), parseInt(h, 10)].sort(
		(a, b) => a - b
	);

	return (
		smallestPerimeter[0] + smallestPerimeter[0] + smallestPerimeter[1] + smallestPerimeter[1] + bow
	);
});

const totalWrappingPaper = workableData.reduce((acc, d) => acc + d, 0);

console.log(totalWrappingPaper);
