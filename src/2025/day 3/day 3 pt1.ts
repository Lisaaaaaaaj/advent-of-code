import {realData} from './input.ts';

const workableData = [...realData.split(/\n/g)]
    .filter((d) => d.length)
    .map(data => {
        const findMaxFirstIndexAndVal = (arr:number[]) => {
            const maxValueExcludingLastIndex = Math.max(...arr.slice(0,-1));
        
            return {index: arr.indexOf(maxValueExcludingLastIndex), val: maxValueExcludingLastIndex}
        }

        const {index: firstIndex, val: firstVal} = findMaxFirstIndexAndVal([...data].map(d => +d))

        const findMaxSecondVal = (arr:number[]) => {
            const maxValueExcludingLastIndex = Math.max(...arr.slice(firstIndex+1));
        
            return maxValueExcludingLastIndex;
        }

        const secondVal = findMaxSecondVal([...data].map(d => +d))

        return `${firstVal}${secondVal}`
    });

const totalJoltage = workableData.reduce((acc, val) => {
    return acc + +val;
}, 0);

console.log(totalJoltage)