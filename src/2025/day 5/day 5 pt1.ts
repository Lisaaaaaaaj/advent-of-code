import {realDataIdRanges, realDataAvailableIds} from './input.ts';

const workableDataIdRanges = [...realDataIdRanges.split(/\n/)]
	.map((d) => d.trim().split('-'))
	.map((d) => [parseInt(d[0], 10), parseInt(d[1], 10)]);
const workableDataAvailableIds = [...realDataAvailableIds.split(/\n/)]
	.map((d) => parseInt(d, 10));

let howIdsManyAreFresh = 0;

workableDataAvailableIds.forEach(id => {
   if ( workableDataIdRanges.some(range => id >= range[0] && id <= range[1]) ) {
        howIdsManyAreFresh++;
   }
})

console.log(howIdsManyAreFresh)