import {realData} from './input.ts';

const workableData = [...realData.split(/\n/g)]
    .filter((d) => d.length)
    .map(data => {
        const totalLength = data.length;
        const targetLength = 12;
        let startIndex = 0;
        let resultDigits = [];
        
        for (let i = 0; i < targetLength; i++) {
            let maxDigit = '';
            let maxDigitIndex = startIndex;
            
            let searchWindowEnd = totalLength - (targetLength - i);

            for (let j = startIndex; j <= searchWindowEnd; j++) {
                const currentDigit = data[j];

                if (currentDigit > maxDigit) {
                    maxDigit = currentDigit;
                    maxDigitIndex = j;
                }
            }
            
            resultDigits.push(maxDigit);

            startIndex = maxDigitIndex + 1; 
        }

        return resultDigits.join('');
    });

const totalJoltage = workableData.reduce((acc, val) => {
    return acc + +val;
}, 0);

console.log(totalJoltage)