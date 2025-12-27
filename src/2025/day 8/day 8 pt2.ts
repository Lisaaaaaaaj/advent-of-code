import { realData } from "./input.ts";

const workableData = [...realData.split(/\n/)].map((data, id) => {
    const [x,y,z] = data.split(',').map(Number);

    return {id, x, y, z};
});

class UnionFind {
    parent: number[];
    numCircuits: number;

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.numCircuits = n;
    }
    find(i: number): number {
        if (this.parent[i] === i) {
            return i;
        }

        return this.parent[i] = this.find(this.parent[i]);
    }
    union(i: number, j: number) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
            this.numCircuits--;

            return true;
        }

        return false;
    }
}

const determineLastJunctionToMakeFullCircuit = () => {
    const edges = [];

    for (let i = 0; i < workableData.length; i++) {
        for (let j = i + 1; j < workableData.length; j++) {
            const dist = Math.hypot(workableData[j].x - workableData[i].x, workableData[j].y - workableData[i].y, workableData[j].z - workableData[i].z);
        
            edges.push({ u: i, v: j, dist });
        }
    }

    edges.sort((a, b) => a.dist - b.dist);

    const unionJuctions = new UnionFind(workableData.length);

    let lastEdge: {
        u: number;
        v: number;
        dist: number;
    } = {
        u: 0,
        v: 0,
        dist: 0
    } 

    for (const edge of edges) {
        if (unionJuctions.union(edge.u, edge.v)) {
            if (unionJuctions.numCircuits === 1) {
                lastEdge = edge;
                break;
            }
        }
    }

    return [
        workableData[lastEdge.u],
        workableData[lastEdge.v],
    ]
}
const relevantJunctions = determineLastJunctionToMakeFullCircuit();
console.log(relevantJunctions)

const multipliedXCoordinates = relevantJunctions[0].x * relevantJunctions[1].x;
console.log(multipliedXCoordinates)
