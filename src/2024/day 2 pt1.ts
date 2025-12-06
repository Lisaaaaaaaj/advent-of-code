const workableData: { safe: boolean; report: number[] }[] = [...realData.split(/\n\t/)]
	.map((d) => d.split(' '))
	.filter((d) => d.length > 0)
	.map((d) => ({ safe: true, report: d.map((dd) => parseInt(dd, 10)) }));

const safeReports = workableData
	.map((d) => {
		const allIncreasing = [];
		const allDecreasing = [];

		for (let i = 0; i < d.report.length; i++) {
			if (d.report[i] < d.report[i + 1]) {
				allIncreasing.push(true);
			} else if (d.report[i] > d.report[i + 1]) {
				allDecreasing.push(true);
			}

			const diff = Math.abs(d.report[i + 1] - d.report[i]);

			if (diff && !(diff >= 1 && diff <= 3)) {
				d.safe = false;
			}

			if (d.report[i] < d.report[i + 1] && allDecreasing.some((ad) => ad)) {
				d.safe = false;
			}

			if (d.report[i] > d.report[i + 1] && allIncreasing.some((ad) => ad)) {
				d.safe = false;
			}

			if (d.report[i] === d.report[i + 1]) {
				d.safe = false;
			}
		}

		return d;
	})
	.filter((d) => d.safe).length;

console.log(safeReports);
