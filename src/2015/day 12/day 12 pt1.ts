import { realData } from './input.ts';

const sumOfAllNumbers = [...realData.matchAll(/[-+]?\d*\.?\d+/g)].reduce((acc, val) => acc += parseInt(val[0], 10), 0);

console.log(sumOfAllNumbers)
