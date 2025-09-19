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

const findLargestCliqueByCustomLookup = (pairs: string[][]) => {
	const filteredAllPairs = [...pairs]
		.reduce((acc, d) => {
			const arr = [...acc].find((a) => d.some((b) => a.includes(b)));

			if (arr) {
				arr.push(...d);
			} else {
				acc.push(d);
			}

			return acc;
		}, [] as string[][])
		.slice(1);

	filteredAllPairs.shift();

	return filteredAllPairs
		.sort((a, b) => (a.length > b.length ? -1 : 0))
		.map((m) => [...new Set(m)])[0]
		.sort()
		.join(',');
};

const ans = findLargestCliqueByCustomLookup(allPairs);

console.log(ans);
