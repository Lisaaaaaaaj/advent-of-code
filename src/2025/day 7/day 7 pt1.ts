import { realData } from "./input.ts";

type Direction = 'u' | 'd' | 'l' | 'r';
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

const directions: { [key in Direction]: [number, number] } = {
    r: [0, 1],
    l: [0, -1],
    u: [-1, 0],
    d: [1, 0],
};

const runBeams = (wMap: Beam[][], direction: [number, number]) => {
    const energizedBeams: Set<string> = new Set();

    const startPos = wMap[0].filter((point => point.char === 'S') )[0];

    const activeBeams: Array<Beam & { lastPos: [number, number]; nextPos: [number, number] }> = [
        { ...startPos, char: '.', lastPos: directions['u'], nextPos: direction },
    ];

    let beam = { ...activeBeams[0], char: '.'};

    const nextBeamDirection = (
        activeBeamPos: [number, number],
        dir: [number, number]
    ): [number, number] => {
        const [row, col] = activeBeamPos;
        const [nextRow, nextCol] = dir;

        return [row + nextRow, col + nextCol];
    };

    while (activeBeams.length > 0) {
        beam = activeBeams[0];
        activeBeams.shift();

        const rowOutOfBounds = beam.pos[0] < 0 || beam.pos[0] >= wMap[0].length;
        const columnOutOfBounds = beam.pos[1] < 0 || beam.pos[1] >= wMap.length;
        if (rowOutOfBounds || columnOutOfBounds) {
            continue;
        }

        const nextBeam = wMap[beam.pos[0]][beam.pos[1]];
        const [nextBeamRow, nextBeamCol] = nextBeamDirection(beam.pos, beam.nextPos);

        if (energizedBeams.has(JSON.stringify([beam.pos, beam.lastPos]))) {
            continue;
        } else if (nextBeam.char === '.') {
            energizedBeams.add(JSON.stringify([beam.pos, beam.lastPos]));
        }

        if (['.', 'S'].includes(nextBeam.char)) {
            activeBeams.push({
                char: nextBeam.char === 'S' ? '.' : beam.char,
                pos: [nextBeamRow, nextBeamCol],
                lastPos: beam.lastPos,
                nextPos: beam.nextPos,
            });
        } else if (['^'].includes(nextBeam.char)) {
            activeBeams.push({
                char: nextBeam.char,
                pos: nextBeamDirection(beam.pos, directions['l']),
                lastPos: directions['l'],
                nextPos: directions['d'],
            });
            activeBeams.push({
                char: nextBeam.char,
                pos: nextBeamDirection(beam.pos, directions['r']),
                lastPos: directions['r'],
                nextPos: directions['d'],
            });
        } 
    }

    return energizedBeams;
};
const energizedBeams = runBeams(workableMap, directions['d']);

const energizedMap = (eMap: Set<string>) => {
    Array.from(eMap).forEach((beam) => {
        const wMapPos = beam.replace(/(\[|\])/g, '').split(',', 2);
        workableMap[parseInt(wMapPos[0], 10)][parseInt(wMapPos[1], 10)].char = '|';
    });
};
energizedMap(energizedBeams);

console.log(workableMap.map(w =>  w.map(x => x.char).join('')));

let totalSplitted = 0;

const filteredSplittedWorkableMap = workableMap.map((w) => w.filter((x) => x.char === '^'));
filteredSplittedWorkableMap.forEach((fwMap) => {
    fwMap.forEach(splitter => {
        if (workableMap[splitter.pos[0] - 1][splitter.pos[1]].char === '|') {
            totalSplitted += 1;
        }
    })
});

console.log(totalSplitted)