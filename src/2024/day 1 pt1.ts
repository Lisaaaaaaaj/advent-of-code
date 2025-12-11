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

console.log(ascSortedLeftList);
console.log(ascSortedRightList);

let ans = 0;

ascSortedLeftList.forEach((d, index) => {
	const smol = Math.min(ascSortedRightList[index], d);
	const largh = Math.max(ascSortedRightList[index], d);

	ans += largh - smol;
});

console.log(ans);
