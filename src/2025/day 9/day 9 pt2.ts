import { realData } from './input.ts';

const workableData = [...realData.split(/\n/)].map(data => {
    const [x,y] = data.split(',').map(Number);

    return [x, y];
});

const findLargestRectangle = () => {
    const insideBoundary = (points: number[]) => {
        const [x1, y1, x2, y2] = points;

        return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)]
    };
    
    const points = workableData.flatMap((point, index) => workableData.slice(index + 1).map(nextPoint => insideBoundary([...point,...nextPoint])));
    const edges = workableData.map((point, index) => {
        const nextPoint = (index + 1) % workableData.length;

        return insideBoundary([...point, ...workableData[nextPoint]])}
    );

    const calcArea = (points: number[]) => {
        const [x1, y1, x2, y2] = points;
        const width = Math.abs(x1 - x2) + 1;
        const height = Math.abs(y1 - y2) + 1;
        const area = width * height;

        return area;
    };

    const relevantArea = points
    .sort((a: number[],b: number[]) => calcArea(b) - calcArea(a))
    .filter(point => {
        const [pLeft, pTop, pRight, pBottom] = point;
        const findNotOverlappingEdge = !edges.find(edge => {
            const [eLeft, eTop, eRight, eBottom] = edge;

            return eLeft < pRight && eRight > pLeft && eTop < pBottom && eBottom > pTop;
        })
        
        return findNotOverlappingEdge;
    })[0];

    return calcArea(relevantArea);
}

console.log(findLargestRectangle())