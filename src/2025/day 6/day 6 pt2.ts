import {realDataNumbers, realDataSymbols} from './input.ts';

const addProblem = (currProblem:number, problem: number) => problem + currProblem;
const multiplyProblem = (currProblem:number, problem: number) => problem * currProblem;

const workableProblems = [...realDataNumbers.split(/\n/)];
const workableSymbols = [...realDataSymbols.split(/\n/)].flatMap(numbers => {
    return numbers.split(' ').filter(d => d.length > 0)
});

const orderLines = (pattern: string[], searchType: 'vertical' | 'horizontal') => {
	const verticalLength = pattern[0].length;
	const horizontalLength = pattern.length;
	const searchLength = searchType === 'horizontal' ? horizontalLength : verticalLength;
	const searchLengthWithin = searchLength === horizontalLength ? verticalLength : horizontalLength;

	const lines: string[][] = [];

	for (let i = 0; i < searchLength; i++) {
		lines.push([]);

		for (let j = 0; j < searchLengthWithin; j++) {
			if (searchType === 'vertical') {
				lines[i].push(pattern[j].charAt(i));
			} else {
				lines[i].push(pattern[i].charAt(j));
			}
		}
	}

	return lines;
};

const orderedVerticalLines = orderLines(workableProblems, 'vertical');

console.log(orderedVerticalLines)

let symbolIndex = 0;
const problems: {symbol: string, numbers: number[]}[] = []

orderedVerticalLines.forEach(line => {
    if (line.every(char => char === ' ')) {
        symbolIndex++;
    } else {
        if (!problems[symbolIndex]) {
            problems[symbolIndex] = {symbol: workableSymbols[symbolIndex], numbers:[]}
        }

        problems[symbolIndex].numbers.push(parseInt(line.join(''),10))
    }
})

const grandTotal = problems.reduce((acc, problem) => {
    if (problem.symbol === '+') {
        const total = problem.numbers.reduce((tAcc, num) => addProblem(tAcc,num), 0);

        return acc += total;
    }           
    
    const firstProblem:number = problem.numbers.shift() as number;
    const total = problem.numbers.reduce((tAcc, num) => multiplyProblem(tAcc,num), firstProblem);
    
    return acc += total;
}, 0);

console.log(grandTotal);
