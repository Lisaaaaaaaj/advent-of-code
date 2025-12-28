import { realData } from './input.ts'

const workableData = [...realData.split(/\n/)].map(data => {
    const [x,y] = data.split(',').map(Number);

    return [x, y];
});

let maxArea = 0;

for (let i = 0; i < workableData.length; i++) {
    for (let j = i + 1; j < workableData.length; j++) {
        const width = Math.abs(workableData[i][0] - workableData[j][0]) + 1;
        const height = Math.abs(workableData[i][1] - workableData[j][1]) + 1;
        const area = width * height;

        if (area > maxArea) {
            maxArea = area;
        }
    }
}
console.log(maxArea);