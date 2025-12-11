import { realData } from "./input.ts";

const matchInvalidIds = /\b(\d+)\1{1,}\b/g;

const handleIsInvalidId = (id:string) => new RegExp(matchInvalidIds).test(id)

let invalidIdsSum = 0;

const addInvalidIdToSum = (id:string) => invalidIdsSum += parseInt(id,10);

[...realData.split(/\n|,/g)]
	.filter((d) => d.length)
	.forEach(data => {
        const [firstId, lastId] = data.split(/-/g).filter(d =>d.trim().length)

        const firstIdIsInvalid = handleIsInvalidId(firstId)
        const lastIdIsInvalid = handleIsInvalidId(lastId)

        if (firstIdIsInvalid) {
            addInvalidIdToSum(firstId)
        }
        if (lastIdIsInvalid) {
            addInvalidIdToSum(lastId)
        }

        for (let i =parseInt(firstId, 10)+1; i < parseInt(lastId,10); i++) {
            if (handleIsInvalidId(i.toString())){
                addInvalidIdToSum(i.toString())
            }
        }
    });

console.log(invalidIdsSum)