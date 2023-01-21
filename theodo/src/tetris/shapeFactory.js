import {random_letter} from "../utils/letterPicker";


const SHAPES = [
    {
        shape: [
            {x:0, y:0, letter: ''},
            {x:0, y:1, letter: ''},
            {x:1, y:0, letter: ''},
            {x:1, y:1, letter: ''}
        ],
        width: 2,
        height: 2,
        rotate: false
    },
    {
        shape: [
            {x:0, y:0, letter: ''},
            {x:0, y:1, letter: ''},
            {x:0, y:2, letter: ''},
            {x:0, y:3, letter: ''}
        ],
        width: 1,
        height: 4
    },
    {
        shape: [
            {x:0, y:0, letter: ''},
            {x:0, y:1, letter: ''},
            {x:0, y:2, letter: ''},
            {x:1, y:2, letter: ''}
        ],
        width: 1,
        height: 3
    }
];

export function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}
