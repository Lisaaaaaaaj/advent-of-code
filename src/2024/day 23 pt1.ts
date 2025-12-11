// 2819 too high
// 1599 <-- this is correct, lol I used indexOf instead of charAt(0) :D

const workableData = [...realData];

const vectorList: Set<string> = new Set();
const connectedVectors: Set<string> = new Set();

const foundAllConnectedVectors = () => {
	const findRelevantVector = (vec: string) => {
		let vecIndex = [...vectorList].indexOf(vec);

		if (vecIndex === -1) {
			vecIndex = vectorList.size;
			vectorList.add(vec);
		}

		return vecIndex;
	};

	[...workableData].forEach((d) => {
		const [parent, ...neighbors] = d.split(/-/);

		neighbors.forEach((neighborVec) => {
			connectedVectors.add(
				JSON.stringify([findRelevantVector(parent), findRelevantVector(neighborVec)])
			);
		});
	});
};
foundAllConnectedVectors();

type AdjacencyMatrix = number[][];
const buildAjacencyMatrix = () => {
	const numberOfVertices = vectorList.size;
	const g: {
		vertices: number;
		edges: number;
		edge: Set<string>;
	} = { vertices: numberOfVertices, edges: numberOfVertices, edge: new Set() };

	[...connectedVectors].forEach((vec) => {
		const [src, dest] = JSON.parse(vec);

		if (!g.edge.has(JSON.stringify({ src, dest }))) {
			g.edge.add(JSON.stringify({ src, dest }));
		}
	});

	const adjacency_matrix: AdjacencyMatrix = Array.from({ length: numberOfVertices }, () =>
		Array(numberOfVertices).fill(0)
	);

	for (let i = 0; i < g.edge.size; i++) {
		adjacency_matrix[JSON.parse([...g.edge][i]).src][JSON.parse([...g.edge][i]).dest] = 1;
		adjacency_matrix[JSON.parse([...g.edge][i]).dest][JSON.parse([...g.edge][i]).src] = 1;
	}

	return adjacency_matrix;
};
const adjMatrix = buildAjacencyMatrix();

function findTriangles(M: number[][]) {
	const seen = new Set();
	const res = [];

	for (let i = 0; i < M.length; i++) {
		for (let j = i; j < M.length; j++) {
			if (M[i][j] === 0) {
				continue;
			}

			for (let k = i; k < M.length; k++) {
				if (M[j][k] > 0 && M[k][i] > 0 && !seen.has(JSON.stringify([i, j, k].sort()))) {
					seen.add(JSON.stringify([i, j, k].sort()));
					res.push([[...vectorList][i], [...vectorList][j], [...vectorList][k]]);
				}
			}
		}
	}

	return res;
}

const allPairs = findTriangles(adjMatrix);
const onlyPairsMinimumOneStartingWithLetterT = allPairs.filter((f) =>
	f.find((computer) => computer.charAt(0) === 't')
);

const ans = onlyPairsMinimumOneStartingWithLetterT.length;

console.log(allPairs);
console.log(onlyPairsMinimumOneStartingWithLetterT);
console.log(ans);
