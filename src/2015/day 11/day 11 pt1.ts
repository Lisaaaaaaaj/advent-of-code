import { realData } from './input.ts';

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const maxIndex = alphabet.length - 1;

const passRule1 = (p: string) => {
    for (let i = 0; i < p.length - 2; i++) {
        if (alphabet.findIndex((l, idx) => p[i] === l && alphabet[idx + 1] === p[i + 1] && alphabet[idx + 2] === p[i + 2]) !== -1) return true;
    }

    return false;
};
const passRule2 = (p: string) => !['i', 'o', 'l'].some(char => p.includes(char));
const passRule3 = (p: string) => {
    const pairs = p.match(/(.)\1/g) || [];

    return new Set(pairs).size >= 2;
};

const increment = (pwd: string): string => {
    let chars = pwd.split('');

    for (let i = chars.length - 1; i >= 0; i--) {
        let idx = alphabet.indexOf(chars[i]);

        if (idx === maxIndex) {
            chars[i] = alphabet[0];
        } else {
            chars[i] = alphabet[idx + 1];
            break;
        }
    }

    return chars.join('');
};

let password = [...realData].join('');

for (let i = 0; i < 1; i++) {
    password = increment(password);

    while (!(passRule1(password) && passRule2(password) && passRule3(password))) {
        password = increment(password);
    }

    console.log(password);
}


