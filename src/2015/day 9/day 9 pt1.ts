import { dummyData, realData } from './input.ts';

const workableData = [...realData.split(/\n/)].reduce((acc, data) => {
    const [locations, distance] = data.split('=');
    const [l1, l2] = locations.split('to');

    const workableL1 = l1.trim();
    const workableL2 = l2.trim()

    acc.locations.add(workableL1);
    acc.locations.add(workableL2);

    acc.distances.push([workableL1, workableL2, parseInt(distance, 10)])

    return acc;

}, { locations: new Set<string>(), distances: [] as [string, string, number][] });

const permutatedData: string[][] = []

const permutate = (arr: string[], start: number) => {
    if (start === arr.length - 1) {
        permutatedData.push([...arr]);

        return;
    }

    for (let i = start; i < arr.length; i++) {
        [arr[start], arr[i]] = [arr[i], arr[start]];

        permutate(arr, start + 1);

        [arr[start], arr[i]] = [arr[i], arr[start]];
    }
}
permutate([...workableData.locations], 0);

const computedRoutes = permutatedData.map(data => {
    let distance = 0;

    data.forEach((location, index) => {
        const nextIndex = index += 1;

        if (data[nextIndex]) {
            const relevantRoute = workableData.distances.find(item => (item[0] === location && item[1] === data[nextIndex]) || (item[1] === location && item[0] === data[nextIndex]));

            if (!relevantRoute) {
                return;
            }

            distance += relevantRoute[2];
        }
    });

    return distance;
})

console.log(computedRoutes)

const shortestRoute = computedRoutes.sort()[0];

console.log(shortestRoute);