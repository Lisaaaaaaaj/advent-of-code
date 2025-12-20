import { realDataIdRanges } from './input.ts';

const workableDataIdRanges = [...realDataIdRanges.split(/\n/)]
	.map((d) => d.trim().split('-'))
	.map((d) => [parseInt(d[0], 10), parseInt(d[1], 10)]);

let freshIds = 0;

const mergeRanges = (range:number[][]) => {
   range.sort((a, b) => a[0] - b[0]);

   const merged = [range[0]];

   for (let i = 1; i < range.length; i++) {
      const [start, end] = range[i];
      let prev = merged[merged.length - 1];

      if (prev[1] >= start) {
         prev[1] = Math.max(prev[1], end);
      } else {
         merged.push(range[i]);
      }
   }

   return merged;
};

console.log(mergeRanges(workableDataIdRanges))

mergeRanges(workableDataIdRanges).forEach(range => {
   freshIds+=1;
   freshIds += range[1] - range[0]
})

console.log(freshIds)