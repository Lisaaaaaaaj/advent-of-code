type Direction = 'u' | 'd' | 'l' | 'r';
type Beam = {
    char: string;
    pos: [number, number];
};



const mappedMap = realMap.map((line, lineIndex) => {
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

    const activeBeams: Array<Beam & { lastPos: [number, number]; nextPos: [number, number] }> = [
        { ...wMap[0][0], lastPos: directions['l'], nextPos: direction },
    ];

    let beam = { ...activeBeams[0], char: wMap[0][0].char };

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

        if (energizedBeams.has(JSON.stringify([beam.pos, beam.lastPos]))) {
            continue;
        } else {
            energizedBeams.add(JSON.stringify([beam.pos, beam.lastPos]));
        }

        const nextBeam = wMap[beam.pos[0]][beam.pos[1]];
        const [nextBeamRow, nextBeamCol] = nextBeamDirection(beam.pos, beam.nextPos);

        if (nextBeam.char === '.') {
            activeBeams.push({
                char: beam.char,
                pos: [nextBeamRow, nextBeamCol],
                lastPos: beam.lastPos,
                nextPos: beam.nextPos,
            });
        } else if (['|', '-'].includes(nextBeam.char)) {
            const mirrSplit = nextBeam.char === '|';

            if (
                [directions[mirrSplit ? 'u' : 'l'], directions[mirrSplit ? 'd' : 'r']].includes(
                    beam.lastPos
                )
            ) {
                activeBeams.push({
                    char: beam.char,
                    pos: [nextBeamRow, nextBeamCol],
                    lastPos: beam.lastPos,
                    nextPos: beam.nextPos,
                });
            } else {
                activeBeams.push({
                    char: beam.char,
                    pos: nextBeamDirection(beam.pos, directions[mirrSplit ? 'u' : 'l']),
                    lastPos: directions[mirrSplit ? 'd' : 'r'],
                    nextPos: directions[mirrSplit ? 'u' : 'l'],
                });
                activeBeams.push({
                    char: beam.char,
                    pos: nextBeamDirection(beam.pos, directions[mirrSplit ? 'd' : 'r']),
                    lastPos: directions[mirrSplit ? 'u' : 'l'],
                    nextPos: directions[mirrSplit ? 'd' : 'r'],
                });
            }
        } else if (['L', 'R'].includes(nextBeam.char)) {
            const mirrDir = nextBeam.char === 'R';
            const relevantDir = [
                directions['u'],
                directions['d'],
                directions['l'],
                directions['r'],
            ].find((dir) => beam.lastPos === dir);

            if (relevantDir) {
                const mappedDirs = {
                    [directions.u.toString()]: {
                        dir: directions[mirrDir ? 'l' : 'r'],
                        lastPos: directions[mirrDir ? 'r' : 'l'],
                        nextPos: directions[mirrDir ? 'l' : 'r'],
                    },
                    [directions.d.toString()]: {
                        dir: directions[mirrDir ? 'r' : 'l'],
                        lastPos: directions[mirrDir ? 'l' : 'r'],
                        nextPos: directions[mirrDir ? 'r' : 'l'],
                    },
                    [directions.l.toString()]: {
                        dir: directions[mirrDir ? 'u' : 'd'],
                        lastPos: directions[mirrDir ? 'd' : 'u'],
                        nextPos: directions[mirrDir ? 'u' : 'd'],
                    },
                    [directions.r.toString()]: {
                        dir: directions[mirrDir ? 'd' : 'u'],
                        lastPos: directions[mirrDir ? 'u' : 'd'],
                        nextPos: directions[mirrDir ? 'd' : 'u'],
                    },
                }[relevantDir.toString()];

                activeBeams.push({
                    char: beam.char,
                    pos: nextBeamDirection(beam.pos, mappedDirs.dir),
                    lastPos: mappedDirs.lastPos,
                    nextPos: mappedDirs.nextPos,
                });
            }
        }
    }

    return energizedBeams;
};
const energizedBeams = runBeams(workableMap, directions['r']);

const energizedMap = (eMap: Set<string>) => {
    Array.from(eMap).forEach((beam) => {
        const wMapPos = beam.replace(/(\[|\])/g, '').split(',', 2);
        workableMap[parseInt(wMapPos[0], 10)][parseInt(wMapPos[1], 10)].char = '#';
    });
};
energizedMap(energizedBeams);

let totalEnergized = 0;

const filteredWorkableMap = workableMap.map((w) => w.filter((x) => x.char === '#'));
filteredWorkableMap.forEach((fwMap) => {
    totalEnergized += fwMap.length;
});

console.log(totalEnergized);
console.log(workableMap.map(w => w.map(x => x.char).join('')));
