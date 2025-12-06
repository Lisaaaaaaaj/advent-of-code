const regex = /\\x.{0,2}|\\\\|\\"/g;

const realData = String.raw`
	`;

const workableData = [...realData.split(/\n\t/g)]
	.filter((d) => d.length)
	.reduce(
		(acc, d) => {
			const codeRepLength = d.trim().length;
			const replacedStrLength = d.trim().replaceAll(regex, '9').length - 2;

			return {
				codeRepLength: (acc.codeRepLength += codeRepLength),
				replacedStrLength: (acc.replacedStrLength += replacedStrLength),
			};
		},
		{ codeRepLength: 0, replacedStrLength: 0 } as {
			codeRepLength: number;
			replacedStrLength: number;
		}
	);

const ans = workableData.codeRepLength - workableData.replacedStrLength;

console.log(ans);
