import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Board from "./tetris/board";
import background from "./background.webp";

function Game() {
    return (
        <div className='background'>
            <div className="t-parent" style={{ backgroundImage: `url(${background})`, backgroundSize:'cover'}}>
                <Board/>
            </div>
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
