import React, { memo, useEffect, useRef } from 'react';
import {useBoard2} from "./useBoard2";
import {random_letter} from "../utils/letterPicker";

const Board2 = () => {

    const [display, score, onKeyDown] = useBoard2();
    const eBoard = useRef();

    console.log(display);


    useEffect(focusBoard, []);

    function focusBoard() {
        eBoard.current.focus();
    }

    return (
        <div ref={eBoard} className={'t-board'} tabIndex={0} onKeyDown={ onKeyDown }>
            <div>
                <span className="t-score-label">Score: </span>
                <span className="t-score-label">{score.toLocaleString()}</span>
            </div>
            {display.map( (row, index) => <Row row={row} key={index}/>)}
        </div>
    );
};

const Row = memo( props => {
    return (
        <span className='t-row'>
            {props.row.map( (cell, index) => <Cell cell={cell} key={index}/>)}
        </span>
    );
});

const Cell = memo( props => {
    const count = useRef(0);
    count.current++;



    const value = props.cell ? 1 : 0;

    var letter = random_letter();
    
    return (
        <>
            <span className={`t-cell t-cell-${value}`}>
                {value !== 0 && <span className='letter'>{props.cell}</span>}
            </span>
        </>
    );
});

export default memo(Board2);
