import {realDataNumbers, realDataSymbols} from './input.ts';

const addProblem = (currProblem:number, problem: number) => problem + currProblem;
const multiplyProblem = (currProblem:number, problem: number) => problem * currProblem;

const workableProblems = [...realDataNumbers.split(/\n/)].map(numbers => {
    return numbers.split(' ').filter(d => d.length > 0)
});
const workableSymbols = [...realDataSymbols.split(/\n/)].flatMap(numbers => {
    return numbers.split(' ').filter(d => d.length > 0)
});

const problems:number[] = workableProblems[0].map(data => parseInt(data,10))
workableProblems.shift();

workableProblems.forEach(wProblems => {
    wProblems.forEach((problem, index) => {
        if (workableSymbols[index] === '*') {
            problems[index] = multiplyProblem(problems[index], parseInt(problem,10))
        } else if (workableSymbols[index] === '+') {
            problems[index] = addProblem(problems[index], parseInt(problem,10))
        }
    })
})

const grandTotal = problems.reduce((acc, problem) => acc+=problem,0);

console.log(grandTotal);
