import { dummyDataPt2, realData } from './input.ts'

const deviceToId = new Map<string, number>();
const idToDevice: string[] = [];

const getId = (device: string): number => {
    const found = device.replace(/:$/, "");

    if (!deviceToId.has(found)) {
        deviceToId.set(found, idToDevice.length);
        idToDevice.push(found);
    }

    return deviceToId.get(found) ?? 0;
};

const adjacencyMatrix: Uint32Array[] = [];
const reversedAdjacencyMatrix: number[][] = [];

realData.trim().split('\n').forEach(line => {
    const parts = line.split(/[:\s]+/).filter(Boolean);

    if (parts.length < 2) {
        return;
    }

    const parent = getId(parts[0]);
    const neighbors = parts.slice(1).map(getId);

    adjacencyMatrix[parent] = new Uint32Array(neighbors);

    neighbors.forEach(nextNeighbor => {
        if (!reversedAdjacencyMatrix[nextNeighbor]) {
            reversedAdjacencyMatrix[nextNeighbor] = [];
        }

        reversedAdjacencyMatrix[nextNeighbor].push(parent);
    });
});

const findRelevantPaths = (start: string, target: string) => {
    const startId = getId(start);
    const targetId = getId(target);
    const req1 = deviceToId.get('fft');
    const req2 = deviceToId.get('dac');

    const getReachability = (goal?: number) => {
        const reachablePath = new Uint8Array(idToDevice.length);

        if (goal === undefined) {
            return reachablePath;
        }

        const queue = [goal];
        reachablePath[goal] = 1;

        while (queue.length > 0) {
            const nextNeighbor = queue.pop();
            
            if(nextNeighbor && reversedAdjacencyMatrix[nextNeighbor]) {
                reversedAdjacencyMatrix[nextNeighbor].forEach(parent => {
                    if (!reachablePath[parent]) { 
                        reachablePath[parent] = 1; 
                        queue.push(parent); 
                    }
                })
            }
        }

        return reachablePath;
    };

    const reachesTarget = getReachability(targetId);
    const reachesReq1 = getReachability(req1);
    const reachesReq2 = getReachability(req2);

    const cache = new Map<number, number>();

    const visited = new Uint8Array(idToDevice.length);

    const countPaths = (parent: number, hasAlreadyReq1: number, hasAlreadyReq2: number): number => {
        const hasReq1 = hasAlreadyReq1 || (parent === req1 ? 1 : 0);
        const hasReq2 = hasAlreadyReq2 || (parent === req2 ? 1 : 0);

        if (parent === targetId) {
            return (hasReq1 && hasReq2) ? 1 : 0;
        }

        const stateKey = (parent << 2) | (hasReq1 << 1) | hasReq2;

        if (cache.has(stateKey)) {
            return cache.get(stateKey) as number;
        }

        let totalPaths = 0;
        visited[parent] = 1;

        const neighbors = adjacencyMatrix[parent];

        if (neighbors) {
            for (let i = 0; i < neighbors.length; i++) {
                const nextNeighbor = neighbors[i];

                const canFinish1 = hasReq1 || reachesReq1[nextNeighbor];
                const canFinish2 = hasReq2 || reachesReq2[nextNeighbor];

                if (!visited[nextNeighbor] && reachesTarget[nextNeighbor] && canFinish1 && canFinish2) {
                    totalPaths += countPaths(nextNeighbor, hasReq1, hasReq2);
                }
            }
        }

        visited[parent] = 0; 

        cache.set(stateKey, totalPaths);

        return totalPaths;
    }

    return countPaths(startId, 0, 0);
}

const pathsOnlyVisitBothRelevantNodes = findRelevantPaths('svr', 'out');

console.log(`Found ${pathsOnlyVisitBothRelevantNodes} paths from 'svr' to 'out' including both 'fft' and 'dac'`);
