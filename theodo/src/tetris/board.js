import React, { memo, useEffect, useRef } from 'react';
import {useBoard} from "./useBoard";


const Board = () => {

    const [display, score, onKeyDown] = useBoard();
    const eBoard = useRef();

    useEffect(focusBoard, []);

    function focusBoard() {
        eBoard.current.focus();
    }

    return (
        <div ref={eBoard} className={'t-board'} tabIndex={0} onKeyDown={ onKeyDown }>
            <div>
                <span className="t-score-label">Score:</span>
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

    const value = props.cell ? props.cell : 0;

    const sample_letter = random_sample_from_alphabet({
        array : array_of_values
    })

    const letter = sample_letter

    return (
        <>
            <span className={`t-cell t-cell-${value}`}>
                {value == 1 && <span className='letter'>{letter}</span>}
            </span>
        </>
    );
});


const table =
{"A": 0.084966,
 "B": 0.020720,
 "C": 0.045388,
 "D": 0.033844,
 "E": 0.0111607,
 "F": 0.018121,
 "G": 0.024705,
 "H": 0.030034,
 "I": 0.075448,
 "J": 0.001965,
 "K": 0.011016,
 "L": 0.054893,
 "M": 0.030129,
 "N": 0.066544,
 "O": 0.071635,
 "P": 0.031671,
 "Q": 0.001962,
 "R": 0.075809,
 "S": 0.057351,
 "T": 0.069509,
 "U": 0.036308,
 "V": 0.010074,
 "W": 0.012899,
 "X": 0.002902,
 "Y": 0.017779,
 "Z": 0.002722
}

var bins = create_bins_from_probability_weights({
 table_of_probs: table,
 population_size: 1000
})

var array_of_values = create_population_from_bins({
 bins : bins
})


function create_bins_from_probability_weights(options) {
 const res = {};
 Object.keys(options.table_of_probs).forEach(function(key) {
     var prob = options.table_of_probs[key];
     var bin_size = (prob * options.population_size);
     res[key] = bin_size;
 })
 return (res)
}

function create_population_from_bins(options) {
 const res = [];
 Object.keys(options.bins).forEach(function(key) {
     for(var i = 0; i < options.bins[key]; i++) {
         res.push(key);
     }
 })
 return (res)
}

function random_sample_from_alphabet(options) {

 const res = options.array[(Math.floor(Math.random() * options.array.length))];

 return (res)
}


export default memo(Board);
