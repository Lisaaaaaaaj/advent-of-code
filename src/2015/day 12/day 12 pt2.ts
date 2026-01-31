import { realData } from './input.ts';

let workableData = JSON.parse(realData, (_, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && Object.values(value).includes("red")) {
        return undefined;
    }

    return value;
});

let sum = 0;

console.log(workableData)

JSON.stringify(workableData, (_, value) => {
    if (typeof value === 'number') {
        sum += value;
    }

    return value;
});

console.log(sum);
