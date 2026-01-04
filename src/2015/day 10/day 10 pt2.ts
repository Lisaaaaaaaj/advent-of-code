import { realData } from './input.ts';

let sequence = realData;
const playTimes = 50;

const play = (seq: string) => {
    let nextSequence = "";
    let i = 0;

    while (i < seq.length) {
        let count = 1;

        while (i + 1 < seq.length && seq[i] === seq[i + 1]) {
            count += 1;
            i += 1;
        }

        nextSequence += count.toString() + seq[i];
        i += 1;
    }

    return nextSequence;
}

for (let i = 0; i < playTimes; i++) {
    sequence = play(sequence);
}

console.log(sequence.length)