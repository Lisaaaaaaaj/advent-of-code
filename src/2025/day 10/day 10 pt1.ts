import { realData } from './input.ts';

const workableData = [...realData.split(/\n/)].map(data => {
    const [indicatorLights, ...rest] = data.split(' ');
    const [_joltage, ...buttons] = rest.reverse().join(' ').split(' ');

    const workableIndicatorLights = indicatorLights.replaceAll(/\[|\]/g, '');
    const workableStart = workableIndicatorLights.split('').map(light => light === '#' ? '.' : light).join("")
    const workableButtons = [...buttons.reverse()].map(button => button.replaceAll(/\(|\)/g, '').split(',').map(Number))

    return { start: workableStart, schema: workableIndicatorLights, buttons: workableButtons };
})

const toggleButtons = workableData.map(data => {
    const toggle = (light: string, buttons: number[]) => {
        const mappableLights = light.split('');

        buttons.forEach(i => {
            mappableLights[i] = mappableLights[i] === "." ? "#" : ".";
        });

        return mappableLights.join("");
    };

    let queue: [string, string[]][] = [[data.start, []]]; 
    let visited = new Set([data.start]);

    while (queue.length > 0) {
        let [current, path] = queue.shift() as [string, string[]];

        if (current === data.schema) {
            return path;
        }

        for (let btn of data.buttons) {
            let nextState = toggle(current, btn);

            if (!visited.has(nextState)) {
                visited.add(nextState);
                queue.push([nextState, [...path, btn.join(',')]]);
            }
        }
    }
})

const fewestButtonPresses = toggleButtons.reduce((acc, buttonPresses) => acc += buttonPresses?.length ?? 0, 0);

console.log(fewestButtonPresses);