import {useEffect, useState} from 'react';
import {useInterval} from "./useInterval";
import {randomShape} from "./shapeFactory";
import { random_letter } from '../utils/letterPicker';
import {checkIfWord} from '../utils/wordDetection';

export const ROW_COUNT = 15;
export const COLUMN_COUNT = 10;

function copyScene(scene) {
    return scene.map(row=>row.slice());
}

function mergeIntoStage(stage, shape, position) {
    let res = stage;

    shape.shape.forEach( point => {
        const x = point.x + position.x;
        const y = point.y + position.y;

        if (x<0 || y<0 || x>=COLUMN_COUNT || y>=ROW_COUNT) { return; }
        
        if (y < 4){ point.letter = random_letter()};  

        res = updateStage(res, x, y, (1, point.letter));
    });


    return res;
}

function updateStage(stage, x, y, cell) {
    if (stage[y][x]===cell) { return stage; }
    const res = stage.slice();
    res[y] = stage[y].slice();
    res[y][x] = cell;
    return res;
}

function createEmptyScene() {
    return Array.from(Array(ROW_COUNT), ()=> Array(COLUMN_COUNT).fill(0) );
}

export function useBoard() {

    const [scene, setScene] = useState(()=> createEmptyScene() );
    const [shape, setShape] = useState(()=> randomShape() );
    const [position, setPosition] = useState({x: 0, y: 0});
    const [display, setDisplay] = useState( ()=> mergeIntoStage(scene, shape, position) );
    const [score, setScore] = useState( 0);

    useEffect(updateDisplay, [scene, shape, position]);
    useEffect(removeFullLines, [scene]);
    useInterval(tick, 600);

    function updateDisplay() {
        const newDisplay = mergeIntoStage(scene, shape, position);
        setDisplay(newDisplay);
    }

    function tick() {
        if (!movePosition(0, 1)) {
            placeShape();
        }
    }

    function placeShape() {
        setScene(mergeIntoStage(scene, shape, position));
        setShape(randomShape());
        setPosition({x: 0, y: 0});
    }

    function rotateShape() {

        const tX = Math.floor(shape.width / 2);
        const tY = Math.floor(shape.height / 2);

        const newPoints = shape.shape.map( point => {
            let {x,y} = point;

            x -= tX;
            y -= tY;

            // cos 90 = 0, sin 90 = 1
            // x = x cos 90 - y sin 90 = -y
            // y = x sin 90 + y cos 90 = x
            let rX = -y;
            let rY = x;

            rX += tX;
            rY += tY;

            return {x: rX, y: rY};
        });
        const newShape = {
            shape: newPoints,
            width: shape.width,
            height: shape.height,
        };

        if (validPosition(position, newShape)) {
            setShape(newShape);
        }
    }

    function removeFullLines() {

        const newScene = copyScene(scene);
        let touched = false;

        const removeRow = (rY) => {
            for (let y = rY; y > 0; y--) {
                for (let x = 0; x < COLUMN_COUNT - 1; x++) {
                    newScene[y][x] = newScene[y-1][x];
                }
            }
            // insert blank row at top
            for (let x = 0; x < COLUMN_COUNT - 1; x++) {
                newScene[0][x] = 0;
            }

            touched = true;
            setScore( oldVal => oldVal + 1000 );
        };

        for (let y = 0; y < ROW_COUNT; y++) {
            let rowHasWord = false;
            const duplicateScene = copyScene(newScene);
            for (let x = 0; x < COLUMN_COUNT - 1; x++) {
                if (duplicateScene[y][x]!==0) {
                    for (let z = COLUMN_COUNT - 1; z > 0; z--) {
                        if (duplicateScene[y][z] === 0) {
                            duplicateScene[y].splice(z, 1);
                        }
                    }
                    const string = duplicateScene[y].join()
                    let word = string.replace(/,/g,'');
                    for (let x = 0; x < COLUMN_COUNT - 1; x++) {
                        for (let z = COLUMN_COUNT - 1; z > 0; z--) {
                            word = word.slice(x, z);
                            console.log(word);
                            rowHasWord = checkIfWord(word);
                            if (rowHasWord) {
                                removeRow(y);
                            }
                        }
                    }
                    break;
                }
            }
        }

        if (touched) {
            setScene(newScene);
        }
    }

    function onKeyDown(event) {
        switch (event.key) {
            case 'ArrowRight':
                movePosition(1,0);
                event.preventDefault();
                break;
            case 'ArrowLeft':
                movePosition(-1,0);
                event.preventDefault();
                break;
            case 'ArrowDown':
                movePosition(0,1);
                event.preventDefault();
                break;
            case 'ArrowUp':
                rotateShape();
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    function movePosition(x, y) {
        const res = {x: x + position.x, y: y + position.y};

        if (!validPosition(res, shape)) { return false;}

        setPosition(res);

        return true;
    }

    function validPosition(position, shape) {
        return shape.shape.every( point => {
            const tX = point.x + position.x;
            const tY = point.y + position.y;

            if (tX < 0 || tX >= COLUMN_COUNT) { return false; }

            if (tY < 0 || tY >= ROW_COUNT) { return false; }

            if (scene[tY][tX]!==0) { return false; }

            return true;
        });
    }

    return [display, score, onKeyDown];
}
