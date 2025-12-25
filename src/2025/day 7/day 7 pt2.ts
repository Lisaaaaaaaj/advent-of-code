import { realData } from "./input.ts";

type Beam = {
    char: string;
    pos: [number, number];
};

const mappedMap = [...realData.split(/\n/)].map((line, lineIndex) => {
    const lineCollection: Beam[] = [];

    [...line].map((linePart, linePartIndex) => {
        lineCollection.push({
            char: linePart,
            pos: [lineIndex, linePartIndex],
        });
    });

    return lineCollection;
});

const workableMap = [...mappedMap];

const startPos = workableMap[0].filter((point => point.char === 'S') )[0].pos;

const timelines: Record<string, number> = {};

const findTimelines = (nextRow: number, nextCol: number): number => {
    const key = `${nextRow},${nextCol}`;

    if (key in timelines) {
        return timelines[key];
    }

    const rowOutOfBounds = nextRow < 0 || nextRow >= workableMap[0].length;
    const columnOutOfBounds = nextCol < 0 || nextCol >= workableMap.length;
    
    if (rowOutOfBounds || columnOutOfBounds) {
        return 1;
    }

    let result: number = 0;

    if (['^'].includes(workableMap[nextRow][nextCol].char)) {
        result = findTimelines(nextRow + 1, nextCol - 1) + 
                 findTimelines(nextRow + 1, nextCol + 1);
    } else {
        result = findTimelines(nextRow + 1, nextCol);
    }

    timelines[key] = result;

    return result;
}
findTimelines(startPos[0], startPos[1]);

console.log(timelines[`${startPos[0]},${startPos[1]}`])
