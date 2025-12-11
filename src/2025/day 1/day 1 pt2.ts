import { realData } from "./input.ts";

const workableData = [...realData.split(/\n/g)]
	.filter((d) => d.length)
	.map(data => {
        const [rot, dist] = data.split(/(L|R)(.+)/g).filter(d =>d.trim().length)
  
        return [rot,dist]
    });

let dialStart = 50;
let pointsAtZeroTimes = 0;

workableData.forEach(([rot, dist]) => {
    const workableDist = parseInt(dist,10);

    if (rot === 'L') {
        for (let i = 0; i < workableDist; i++) {
            if (dialStart === 0) {
                pointsAtZeroTimes+=1;
                dialStart = 99;
            } else { 
                dialStart -= 1 
            }
        }
    }

    if (rot === 'R') {
        for (let i = 0; i < workableDist; i++) {
            if (dialStart === 0) {
                pointsAtZeroTimes+=1;
            }
            if (dialStart === 99) {
                dialStart = 0;
            } else { 
                dialStart += 1; 
            }
        }
    }
})

console.log(pointsAtZeroTimes)