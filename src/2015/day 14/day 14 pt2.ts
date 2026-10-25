import { dummyData, realData } from './input.ts';

const workableData = realData.split(/\n/).map(reindeer => {
    const matches = reindeer.match(/\d+/g);
    const speed = parseInt(matches![0], 10);
    const duration = parseInt(matches![1], 10);
    const restSeconds = parseInt(matches![2], 10);

    return { speed, duration, restSeconds, distance: 0, points: 0 };
});

for (let i = 0; i < 2503; i++) {
    workableData.forEach(reindeer => {
        const cycleTime = reindeer.duration + reindeer.restSeconds;
        const timeInCycle = i % cycleTime;

        if (timeInCycle < reindeer.duration) {
            reindeer.distance += reindeer.speed;
        }
    });

    const leadReindeers = workableData.sort((a, b) => b.distance - a.distance)
    const highestDistanceAtm = leadReindeers[0].distance;

    leadReindeers.forEach((reindeer, index) => {
        if (reindeer.distance === highestDistanceAtm) {
            leadReindeers[index].points += 1;
        }
    })
}

console.log(workableData);

const result = workableData.map(r => r.points).sort((a, b) => b - a)[0];
console.log(result);
