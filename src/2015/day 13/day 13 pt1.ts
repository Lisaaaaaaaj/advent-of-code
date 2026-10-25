import { dummyData, realData } from './input.ts';

const personRegex = /Alice|Bob|Carol|David|Eric|Frank|George|Mallory/g;

const workableData: {
    [key: string]: [string, string, number][];
} = [...realData.split(/\n/)].reduce((acc, data) => {
    const p1 = data.match(personRegex)![0];
    const p2 = data.match(personRegex)![1];
    const instruction = data.match(/gain|lose/g)![0];
    const amount = data.match(/[0-9]+/g)![0];

    let obj: { [key: string]: [[string, string, number]] } = {};

    if (!acc[p1]) {
        obj[p1] = [[p2, instruction, parseInt(amount, 10)]];
    } else {
        acc[p1].push([p2, instruction, parseInt(amount, 10)])
    }


    return { ...acc, ...obj };
}, {} as { [key: string]: [string, string, number][] });

console.log(workableData);

function getNeighborScore(person: string, neighbor: string) {
    const relation = workableData[person].find(item => item[0] === neighbor);
    if (!relation) return 0;

    const [_, type, value] = relation;

    return type === 'gain' ? value : -value;
}

function getPermutations(arr: string[]) {
    if (arr.length <= 1) return [arr];
    const permutations: string[][] = [];

    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
        const remainingPerms = getPermutations(remaining);

        for (let perm of remainingPerms) {
            permutations.push([current, ...perm]);
        }
    }

    return permutations;
}

function findBestCircleSeating() {
    const people = Object.keys(workableData);
    const allArrangements = getPermutations(people);

    let maxScore = -Infinity;

    for (const arrangement of allArrangements) {
        let currentScore = 0;
        const n = arrangement.length;

        for (let i = 0; i < n; i++) {
            const person = arrangement[i];

            const leftNeighbor = arrangement[(i - 1 + n) % n];
            const rightNeighbor = arrangement[(i + 1) % n];

            currentScore += getNeighborScore(person, leftNeighbor);
            currentScore += getNeighborScore(person, rightNeighbor);
        }

        if (currentScore > maxScore) {
            maxScore = currentScore;
        }
    }

    return maxScore;
}

const result = findBestCircleSeating();
console.log(result);
