const workableData = [...realData];

const prune = (sequence: number) => {
	const pruneNumber = 16777216;

	return ((sequence % pruneNumber) + pruneNumber) % pruneNumber;
};

const mixAndPrunedSecrets = workableData.map((secret) => {
	let relevantSecret = secret;

	for (let i = 0; i < 2000; i++) {
		const sequence1 = prune((relevantSecret * 64) ^ relevantSecret);
		const sequence2 = prune(Math.floor(sequence1 / 32) ^ sequence1);
		const sequence3 = prune((sequence2 * 2048) ^ sequence2);

		relevantSecret = sequence3;
	}

	return relevantSecret;
});

const ans = mixAndPrunedSecrets.reduce((acc, d) => acc + d, 0);

console.log(ans);
