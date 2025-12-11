const leftList: number[] = [];
const rightList: number[] = [];

const workableData = [...realData.split(/\n/)];

workableData.forEach((d) => {
	const [l, r] = d.split(' ').filter((d) => d.trim());

	leftList.push(parseInt(l, 10));
	rightList.push(parseInt(r, 10));
});

const ascSortedLeftList = [...leftList].sort((a, b) => a - b);
const ascSortedRightList = [...rightList].sort((a, b) => a - b);

let ans = 0;

ascSortedLeftList.forEach((d) => {
	const allOccsWithinRightList = ascSortedRightList.filter((dr) => dr === d).length;

	ans += d * allOccsWithinRightList;
});

console.log(ans);
