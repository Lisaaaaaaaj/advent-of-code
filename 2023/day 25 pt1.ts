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
		const [parent, ...neighbors] = d.split(/:?\s+/);

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

const findMinCut = (matrix: AdjacencyMatrix) => {
	let verticesIndex = -1;
	let minCut = Number.MAX_SAFE_INTEGER;
	const disconnectedGroup = Array.from({ length: vectorList.size }, (_, i) => [i]);

	const calcMinMaxCut = (weights: number[]) => {
		let maxIndex = 0;

		for (let i = 1; i < weights.length; i++) {
			if (weights[i] > weights[maxIndex]) {
				maxIndex = i;
			}
		}

		return maxIndex;
	};

	for (
		let disconnectedVectorListLength = 1;
		disconnectedVectorListLength < vectorList.size;
		disconnectedVectorListLength++
	) {
		const weights = Array.from({ length: vectorList.size }, (_, i) => matrix[0][i]);
		let src = 0,
			sink = 0;

		const calcVectorWeights = () => {
			Array.from({
				length: vectorList.size - disconnectedVectorListLength,
			}).forEach(() => {
				weights[sink] = -Number.MAX_SAFE_INTEGER;
				src = sink;
				sink = calcMinMaxCut(weights);

				for (let i = 0; i < vectorList.size; i++) {
					weights[i] += matrix[sink][i];
				}
			});
		};
		calcVectorWeights();

		const updateDisconnectedGroupList = () => {
			const currentMinCut = weights[sink] - matrix[sink][sink];

			if (currentMinCut < minCut) {
				minCut = currentMinCut;
				verticesIndex = sink;
			}

			disconnectedGroup[src] = disconnectedGroup[src].concat(disconnectedGroup[sink]);
		};
		updateDisconnectedGroupList();

		const updateOriginalMatrix = () => {
			for (let i = 0; i < vectorList.size; i++) {
				matrix[src][i] += matrix[sink][i];
				matrix[i][src] = matrix[src][i];
			}

			matrix[0][sink] = -Number.MAX_SAFE_INTEGER;
		};
		updateOriginalMatrix();
	}

	return disconnectedGroup[verticesIndex];
};

const vertices = findMinCut(adjMatrix);
const merryChristmas = vertices.length * (adjMatrix.length - vertices.length);

console.log(merryChristmas);
