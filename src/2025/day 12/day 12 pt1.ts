import { realData } from './input.ts';

const shapes: string[][] = [];
let shapeIndex = 0;

const workableData: {
    area: number[];
    numOfPresents: number[];
}[] = [...realData.split(/\n/)].map(data => {
    if (data.length > 0) {
        if (data.length === 2) {
            shapeIndex = parseInt(data.split(':')[0],10);
        } else if (data.includes('.') || data.includes('#')) {
            if (!shapes[shapeIndex]) {
                shapes[shapeIndex] = [];
            }

            shapes[shapeIndex].push(data);
        } else {
            const [area, numOfPresents] = data.split(':');
            const [width, height] = area.split('x');

            const workableNumOfPresents = numOfPresents.trim().split(' ').map(Number);

            return { area: [parseInt(width,10), parseInt(height,10)], numOfPresents: workableNumOfPresents}
        } 
    }

    return {area: [], numOfPresents: []};
}).filter(data => data.area.length > 0 && data.numOfPresents.length > 0);

let workableArea: string[] = [];

const orderLines = (pattern: string[], searchType: 'vertical' | 'horizontal') => {
	const verticalLength = pattern[0].length;
	const horizontalLength = pattern.length;
	const searchLength = searchType === 'horizontal' ? horizontalLength : verticalLength;
	const searchLengthWithin = searchLength === horizontalLength ? verticalLength : horizontalLength;

	const lines: string[][] = [];

	for (let i = 0; i < searchLength; i++) {
		lines.push([]);

		for (let j = 0; j < searchLengthWithin; j++) {
			if (searchType === 'vertical') {
				lines[i].push(pattern[j].charAt(i));
			} else {
				lines[i].push(pattern[i].charAt(j));
			}
		}
	}

	return lines;
};

const needNoFlip = (mapToFlip: string[]) =>
	mapToFlip.every((d, rowIndex) => {
		return d
			.split('')
			.every((dd, colIndex) => (dd === '#' ? workableArea[rowIndex][colIndex] === '.' : true));
	});

const memoizedOrientations = new Map<number, string[][]>();

const flipUntilMatchWorkableData = (mapToFlip: string[], index: number): string[][] => {
    if (memoizedOrientations.has(index)) {
        return memoizedOrientations.get(index)!;
    }

    const variants = new Set<string>();
    let current = mapToFlip;

    for (let i = 0; i < 4; i++) {
        // Rotate 90
        current = orderLines(current.slice().reverse(), 'vertical').map(l => l.join(''));
        variants.add(JSON.stringify(current));
        // Flip
        variants.add(JSON.stringify(current.map(row => row.split('').reverse().join(''))));
    }

    const result = Array.from(variants).map(variant => JSON.parse(variant) as string[]);
   
    memoizedOrientations.set(index, result);
    
    return result;
};

const solveGrid = (width: number, height: number, quantities: number[]) => {
    const shapeHashes = shapes.map(shape => shape.join('').split('#').length - 1);
    const totalHashesNeeded = quantities.reduce((acc, quantity, index) => acc + (quantity * shapeHashes[index]), 0);
    
    if (totalHashesNeeded > (width * height)) {
        return false;
    }

    let grid = Array(height).fill(null).map(() => Array(width).fill('.'));
    
    const itemsToPlace = quantities
        .map((quantity, id) => ({ id, quantity, density: shapeHashes[id] }))
        .filter(x => x.quantity > 0)
        .sort((a, b) => b.density - a.density)
        .flatMap(x => Array(x.quantity).fill(x.id));

    const backtrack = (index: number): boolean => {
        if (index === itemsToPlace.length) {
            return true;
        }

        const shapeIndex = itemsToPlace[index];
        const variants = flipUntilMatchWorkableData(shapes[shapeIndex], shapeIndex);

        const updateGrid = (variant: string[], row: number, col: number, char: '.' | '#') => {
            variant.forEach((vRow, i) => vRow.split('').forEach((char, j) => {
                if (char === '#') {
                    grid[row + i][col + j] = '#';
                }
            }));
        }
        
        for (let row = 0; row <= height - 3; row++) {
            for (let col = 0; col <= width - 3; col++) {
                workableArea = grid.slice(row, row + 3).map(row => row.slice(col, col + 3).join(''));

                for (const variant of variants) {
                    if (needNoFlip(variant)) {
                        updateGrid(variant, row, col, '#');

                        if (backtrack(index + 1)) {
                            return true;
                        }

                        updateGrid(variant, row, col, '.');
                    }
                }
            }
        }

        return false;
    };

    return backtrack(0);
};

const fitTheGrid = workableData.reduce((acc, val) => {
    if (solveGrid(val.area[0], val.area[1], val.numOfPresents)) {
        console.log(val)
        return acc +=1;
    }

    return acc;
}, 0);

console.log('Merry christmas!', fitTheGrid)
