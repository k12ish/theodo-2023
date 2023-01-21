
const SHAPES = [
    {
        shape: [
            {x:0, y:0},
            {x:0, y:1},
            {x:1, y:0},
            {x:1, y:1}
        ],
        letters: [], 
        width: 2,
        height: 2,
        rotate: false
    },
    {
        shape: [
            {x:0, y:0, letter: 'A'},
            {x:0, y:1, letter: 'A'},
            {x:0, y:2, letter: 'A'},
            {x:0, y:3, letter: 'A'}
        ],
        width: 1,
        height: 4
    },
    {
        shape: [
            {x:0, y:0},
            {x:0, y:1},
            {x:0, y:2},
            {x:1, y:2}
        ],
        letters: [], 
        width: 1,
        height: 3
    }
];

export function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}
