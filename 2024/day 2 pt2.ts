const workableData: { safe: boolean; report: number[] }[] = [...realData.split(/\n\t/)]
	.map((d) => d.split(' '))
	.filter((d) => d.length > 0)
	.map((d) => ({ safe: false, report: d.map((dd) => parseInt(dd, 10)) }));

const safeReports = workableData
	.map((d) => {
		const sum = (sup: number[]) => {
			let c = 0;

			sup.forEach((s) => (c += s));

			return c;
		};

		const diff = (rep: number[]) => {
			const output = [];

			for (let i = 0; i < rep.length - 1; i++) {
				output.push(rep[i + 1] - rep[i]);
			}

			return output;
		};

		const safe = (rep: number[]) => {
			const differences = diff(rep);

			return (
				Math.abs(sum(differences)) === sum(differences.map(Math.abs)) &&
				Math.min(...differences) >= -3 &&
				Math.max(...differences) <= 3 &&
				differences.filter((x) => x === 0).length === 0
			);
		};

		for (let i = 0; i < d.report.length - 1; i++) {
			if (safe(d.report)) {
				d.safe = true;
				continue;
			} else {
				for (let index = 0; index < d.report.length; index++) {
					const repDamped = d.report.slice();
					repDamped.splice(index, 1);

					if (safe(repDamped)) {
						d.safe = true;
					}
				}
			}
		}

		return d;
	})
	.filter((d) => d.safe).length;

console.log(safeReports);
