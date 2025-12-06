// 7568 too high

const workableData = [...realData];

const randomNumber = (seed: bigint) => {
	seed = ((seed << 6n) ^ seed) % 16777216n;
	seed = ((seed >> 5n) ^ seed) % 16777216n;
	seed = ((seed << 11n) ^ seed) % 16777216n;

	return seed;
};

const calcPrice = (secret: bigint) => secret % 10n;

const mixAndPrunedSecrets = workableData
	.map((p) => BigInt(p))
	.reduce((acc, secret) => {
		let price = secret;
		const secrets = [];
		const consecutiveMatch = new Set();

		for (let i = 0; i < 2000; i++) {
			const sequence = randomNumber(price);

			secrets.push(Number(calcPrice(sequence) - calcPrice(price)));
			price = sequence;

			if (secrets.length === 4) {
				const relevantSecret = secrets.join(',');

				if (!consecutiveMatch.has(relevantSecret)) {
					if (acc[relevantSecret] === undefined) {
						acc[relevantSecret] = [];
					}

					acc[relevantSecret].push(Number(calcPrice(sequence)));
					consecutiveMatch.add(relevantSecret);
				}

				secrets.shift();
			}
		}

		return acc;
	}, {} as { [key: string]: number[] });

console.log(mixAndPrunedSecrets);

const ans = Math.max(
	...Object.values(mixAndPrunedSecrets).map((range) => range.reduce((sum, num) => sum + num, 0))
);
console.log(ans);
