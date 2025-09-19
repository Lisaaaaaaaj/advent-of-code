let lowPulses = 0;
let highPulses = 0;

type WorkableData = {
	ref: string;
	type: '#' | '&' | 'b';
	pulse: 'low' | 'high';
	destModules: string[];
	flipFlop: 'on' | 'off';
	conj: { [key: string]: 'low' | 'high' };
};
type WorkableDatas = {
	[key: string]: WorkableData;
};
const workableData: WorkableDatas = realData
	.split(/\n|\t/g)
	.filter((d) => d.length)
	.reduce((acc, d) => {
		const splittedData = d.split(' ').map((s) => s.replace(',', '').replace('%', '#'));
		const [module, _, ...destModules] = splittedData;
		const [type, ...ref] = module.split('');

		return {
			...acc,
			[ref.join('')]: {
				ref: ref.join(''),
				type,
				pulse: 'low',
				destModules,
				flipFlop: 'off',
				conj: destModules.reduce((acc, m) => ({ ...acc, [m]: 'low' }), {}),
			},
		};
	}, {});

const generatePulse = (pulse: 'low' | 'high', all: WorkableDatas, curr: WorkableData) => {
	for (let i = 0; i < curr.destModules.length; i++) {
		if (pulse === 'high') {
			highPulses += 1;
		} else if (pulse === 'low') {
			lowPulses += 1;
		}

		const currDest = all[curr.destModules[i]];

		if (currDest) {
			if (currDest.type === '#' && pulse === 'low') {
				currDest.flipFlop = currDest.flipFlop === 'off' ? 'on' : 'off';
				currDest.pulse = currDest.flipFlop === 'on' ? 'high' : 'low';

				generatePulse(currDest.pulse, all, currDest);
			} else if (currDest.type === '&') {
				currDest.conj[currDest.destModules[0]] = pulse;

				const everyConjItsFlipFlopHigh = Object.values(currDest.conj).every((p) => p === 'high');
				const everyConjItsFlipFlopIsOn = Object.values(all)
					.filter((d) => d.type === '#' && d.destModules.includes(curr.destModules[i]))
					.every((d) => d.flipFlop === 'on');

				if (everyConjItsFlipFlopHigh && everyConjItsFlipFlopIsOn) {
					currDest.pulse = 'low';
				} else {
					currDest.pulse = 'high';
				}

				generatePulse(currDest.pulse, all, currDest);
			}
		} else {
			return all;
		}
	}
};

for (let i = 0; i < 1000; i++) {
	lowPulses += 1;
	generatePulse('low', workableData, workableData['roadcaster']);
}

const totalPulses = lowPulses * highPulses;

console.log(totalPulses);
