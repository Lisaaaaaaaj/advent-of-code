import { realData } from './input.ts';

const workableData = [...realData.split(/\n/)].map(data => {
    const [_indicatorLights, ...rest] = data.split(' ');
    const [joltage, ...buttons] = rest.reverse().join(' ').split(' ');

    const workableJoltage = joltage.replaceAll(/\{|\}/g, '').split(',').map(Number)
    const workableButtons = [...buttons.reverse()].map(button => button.replaceAll(/\(|\)/g, '').split(',').map(Number))

    return { schema: workableJoltage, buttons: workableButtons };
})

const INFINITY = Infinity;

type ReachedJoltageLvls = {
  total: number,
  presses: number[]
}
const memo: Map<string, ReachedJoltageLvls> = new Map();

const reachJoltageLvls = (target: number[], buttons: number[][]): ReachedJoltageLvls => {
    const key = target.join(',');

    if (target.every((item: number) => item === 0)) {
        return { total: 0, presses: new Array(buttons.length).fill(0) as number[] };
    }

    if (target.some((item: number) => item < 0)) {
        return { total: INFINITY, presses: [] };
    }

    if (memo.has(key)) {
        return memo.get(key) as ReachedJoltageLvls;
    }

    const buttonsLength = buttons.length;
    const parity = target.map((item: number) => item % 2);

    const result: ReachedJoltageLvls = { total: INFINITY, presses: [] };

    for (let i = 0; i < (2 ** buttonsLength); i++) {
        let currentJoltages = new Array(target.length).fill(0);
        let currentPresses = new Array(buttonsLength).fill(0);
        let count = 0;

        for (let j = 0; j < buttonsLength; j++) {
            const toggled = (i >> j) & 1;
            
            if (toggled) {
                buttons[j].forEach((index: number) => currentJoltages[index]++);
                currentPresses[j] = 1;
                count++;
            }
        }

        if (currentJoltages.every((item, index) => item % 2 === parity[index])) {
            const nextTarget = target.map((item: number, index: number) => (item - currentJoltages[index]) / 2);
            const subResult = reachJoltageLvls(nextTarget, buttons);

            if (subResult.total !== INFINITY) {
                const totalPresses = 2 * subResult.total + count;
                
                if (totalPresses < result.total) {
                    result.total = totalPresses;
                    result.presses = subResult.presses.map((p: number, index: number) => 2 * p + currentPresses[index])
                }
            }
        }
    }

    memo.set(key, result);

    return result;
}

let totalPressed = 0;

workableData.forEach(data => {
    memo.clear();
    const result = reachJoltageLvls(data.schema, data.buttons);

    result.presses.forEach((press: number) => totalPressed += press)

    console.log(`Fewest presses: ${result.total}`);
});

console.log(totalPressed)
