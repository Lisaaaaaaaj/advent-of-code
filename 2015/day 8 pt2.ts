const realData = String.raw`
	`;

const workableData = [...realData.split(/\n\t/g)]
	.filter((d) => d.length)
	.reduce(
		(acc, d) => {
			const codeRepLength = d.trim().length;
			const splittedStrLength =
				d
					.trim()
					.split('')
					.reduce((acc, d) => {
						let modifiedStr = '';

						if (d === '"' || d === '\\') {
							modifiedStr += '\\';
						}

						return [...acc, `${modifiedStr}${d}`];
					}, [] as string[])
					.join('').length + 2;

			return {
				codeRepLength: (acc.codeRepLength += codeRepLength),
				replacedStrLength: (acc.replacedStrLength += splittedStrLength),
			};
		},
		{ codeRepLength: 0, replacedStrLength: 0 } as {
			codeRepLength: number;
			replacedStrLength: number;
		}
	);

const ans = Math.abs(workableData.codeRepLength - workableData.replacedStrLength);

console.log(ans);
