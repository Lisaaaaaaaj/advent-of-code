import { realData } from "../day 8/input.ts";

const workableData = [...realData.split(/\n/)].map((data, id) => {
    const [x,y,z] = data.split(',').map(Number);

    return {id, x, y, z}
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

const connectJunctions = () => {
    const edges = [];

    for (let i = 0; i < workableData.length; i++) {
        for (let j = i + 1; j < workableData.length; j++) {
            const dist = Math.hypot(workableData[j].x - workableData[i].x, workableData[j].y - workableData[i].y, workableData[j].z - workableData[i].z);
        
            edges.push({ u: i, v: j, dist });
        }
    }

    edges.sort((a, b) => a.dist - b.dist);

    const unionJuctions = new UnionFind(workableData.length);

    for (let k = 0; k < Math.min(1000, edges.length); k++) {
        const { u, v } = edges[k];

        unionJuctions.union(u, v);
    }

    return unionJuctions
}
const unionJuctions = connectJunctions();

const createCircuits = (uf: UnionFind) => {
    const circuitMap: Record<string, string[]> = {};

    workableData.forEach((box) => {
        const root = uf.find(box.id);
        const createNewRoot = !circuitMap[root];

        if (createNewRoot) {
            circuitMap[root] = []
        };

        circuitMap[root].push(`[${box.x},${box.y},${box.z}]`);
    });

    return Object.values(circuitMap);
}
const circuitMap = createCircuits(unionJuctions)

const [c1, c2, c3] = circuitMap.sort((a,b) => b.length - a.length);

const sizeOfThreeLargestCircuits = c1.length * c2.length * c3.length;

console.log(sizeOfThreeLargestCircuits)