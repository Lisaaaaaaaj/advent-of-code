const conditionalRegex = /don't\(\).*?do\(\)|don't\(\).*/g;
const regex = /mul\(([^)\\(?!:]+)\)/g;

const answer = realData
	.replace(conditionalRegex, '')
	.match(regex)
	?.map((d) => {
		const [l, r] = d.split('mul')[1].replace(/\(|\)/g, '').split(/,/);

		return parseInt(r, 10) ? parseInt(l, 10) * parseInt(r, 10) : 0;
	})
	.reduce((acc, d) => acc + d, 0);

console.log(answer);
