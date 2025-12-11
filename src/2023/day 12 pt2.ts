const determineArrangements = (
	springs: string,
	damage: number[],
	alreadyDeterminedArrangements = new Map()
) => {
	const key = `${springs}:${JSON.stringify(damage)}`;
	const foundDamage = 1;
	const notFoundDamage = 0;
	const currSpring = springs[0];
	const noDamageLeft = (damageLength: number) => damageLength === notFoundDamage;
	const getSpringDamageLength = (damageTypeLength: number) => {
		return noDamageLeft(damageTypeLength) ? foundDamage : notFoundDamage;
	};
	const recursiveSearch = (sp: string, dmg: number[]) =>
		determineArrangements(sp, dmg, alreadyDeterminedArrangements);

	if (alreadyDeterminedArrangements.has(key)) {
		return alreadyDeterminedArrangements.get(key);
	} else if (springs.length === 0) {
		return getSpringDamageLength(damage.length);
	} else {
		let arrangementAmount: number = notFoundDamage;

		if (currSpring === '.') {
			arrangementAmount = recursiveSearch(springs.slice(springs.indexOf('.') + 1), damage);
		} else if (currSpring === '?') {
			arrangementAmount =
				recursiveSearch(springs.slice(1), damage) + recursiveSearch('#' + springs.slice(1), damage);
		} else if (currSpring === '#') {
			const currDmg = damage[0];
			const remainingDamage = damage.slice(1);

			if (currDmg <= springs.length && !springs.slice(0, currDmg).includes('.')) {
				if (currDmg === springs.length) {
					arrangementAmount = getSpringDamageLength(remainingDamage.length);
				} else if (springs[currDmg] !== '#') {
					arrangementAmount = recursiveSearch(springs.slice(currDmg + 1), remainingDamage);
				}
			}
		}

		alreadyDeterminedArrangements.set(key, arrangementAmount);

		return arrangementAmount;
	}
};

const parseRows = (
	input: string
): {
	springs: string;
	damage: number[];
} => {
	const parts = input.split(' ');
	const springs = parts[0];
	const damage = parts[parts.length - 1].split(',').map(Number);
	const unfoldSprings = (spr: string) => Array.from({ length: 5 }, () => spr).join('?');
	const unfoldDamage = (dmg: number[]) => Array.from({ length: 5 }).flatMap(() => dmg);

	return { springs: unfoldSprings(springs), damage: unfoldDamage(damage) };
};

const total = realData
	.map(parseRows)
	.reduce((sum, { springs, damage }) => sum + determineArrangements(springs, damage), 0);

console.log(total);
