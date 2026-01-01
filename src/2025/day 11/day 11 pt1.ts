import { realData } from './input.ts'

const workableData = [...realData.split(/\n/g)].filter(line => line.trim() !== '').reduce((acc, data) => {
    const [parent, ...neighbors] = data.split(/:?\s+/).filter(Boolean);
   
    acc.set(parent, neighbors);

    return acc;
}, new Map as Map<string, string[]>);

const findAllPaths = (data: Map<string, string[]>, start: string, end: string): string[][] => {
    const paths: string[][] = [];

    const walkBranches = (currentNode: string, currentPath: string[]) => {
        currentPath.push(currentNode);

        if (currentNode === end) {
            paths.push([...currentPath]); 
            currentPath.pop(); 

            return;
        }

        const neighbors = data.get(currentNode) || [];

        for (const neighbor of neighbors) {
            if (!currentPath.includes(neighbor)) {
                walkBranches(neighbor, currentPath);
            }
        }

        currentPath.pop();
    };

    walkBranches(start, []);

    return paths;
};

const allPaths = findAllPaths(workableData, 'you', 'out');

allPaths.forEach((path, index) => {
    console.log(`Path ${index + 1}: ${path.join(' -> ')}`);
});

console.log(`Found ${allPaths.length} paths from 'you' to 'out'`);
