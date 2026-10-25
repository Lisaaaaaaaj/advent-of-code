import { dummyData, realData } from './input.ts';

const workableData = realData.split(/\n/).map(reindeer => {
    const matches = reindeer.match(/\d+/g);
    const speed = parseInt(matches![0], 10);
    const duration = parseInt(matches![1], 10);
    const restSeconds = parseInt(matches![2], 10);

    return { speed, duration, restSeconds, distance: 0 };
});

for (let i = 0; i < 2503; i++) {
    workableData.forEach(reindeer => {
        const cycleTime = reindeer.duration + reindeer.restSeconds;
        const timeInCycle = i % cycleTime;

        if (timeInCycle < reindeer.duration) {
            reindeer.distance += reindeer.speed;
        }
    });
}

console.log(workableData);

const result = workableData.map(r => r.distance).sort((a, b) => b - a)[0];
console.log(result);

