let num = 0;

const determineHandType = (hand: string) => {
	const groupedCards: Record<string, number> = {};
	[...hand].reduce((acc, val) => (acc[val] ? (acc[val] += 1) : (acc[val] = 1), acc), groupedCards);

	const type = {
		'five-of-a-kind': 7,
		'four-of-a-kind': 6,
		'full-house': 5,
		'three-of-a-kind': 4,
		'two-pair': 3,
		'one-pair': 2,
		'high-card': 1,
	};

	const sortedCards = Object.values(groupedCards).sort((a, b) => b - a);

	let relevantType = 0;

	switch (sortedCards.toString()) {
		case '5':
			relevantType = type['five-of-a-kind'];
			break;
		case '4,1':
			relevantType = type['four-of-a-kind'];
			break;
		case '3,2':
			relevantType = type['full-house'];
			break;
		case '3,1,1':
			relevantType = type['three-of-a-kind'];
			break;
		case '2,2,1':
			relevantType = type['two-pair'];
			break;
		case '2,1,1,1':
			relevantType = type['one-pair'];
			break;
		case '1,1,1,1,1':
			relevantType = type['high-card'];
			break;
	}

	return relevantType;
};

const determineHighestHand = (currentHand: string, nextHand: string) => {
	const currentHandChars = [...currentHand];
	const nextHandChars = [...nextHand];

	for (let i = 0; i < currentHandChars.length; i++) {
		if (currentHandChars[i] !== nextHandChars[i]) {
			return cards.indexOf(currentHandChars[i]) < cards.indexOf(nextHandChars[i]) ? 1 : -1;
		}
	}

	return -1;
};

const sortedByTypeHandList = handList
	.split(/\n/)
	.filter((filt) => filt !== '')
	.map((list) => {
		const [hand, bid] = list.split(' ');

		return { hand, bid: Number(bid), rank: 0, type: determineHandType(hand) };
	})
	.sort((a, b) => {
		if (a.type > b.type) return 1;
		if (a.type < b.type) return -1;
		return determineHighestHand(a.hand, b.hand);
	});

for (let i = 0; i < sortedByTypeHandList.length; i++) {
	sortedByTypeHandList[i].rank = i + 1;
	num += sortedByTypeHandList[i].bid * sortedByTypeHandList[i].rank;
}

console.log(sortedByTypeHandList);

console.log(num);
