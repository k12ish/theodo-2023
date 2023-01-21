import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Board from "./tetris/board";

function Game() {
    return (
        <>
            <div class="grid"></div>
            <div class="lines"></div>
            <div className='title-container'>
                    {/* <span className='title'>Word Tetris</span> */}
                    <span className='retro'>Word Tetris</span>
            </div>
            <div className='container'>
                
                <div className="t-parent">
                    <Board/>
                    <div className='circle-container'>
                    <div className='circle'></div>
                    <div className='inner-circle'></div>
                    </div>
                </div>
            </div>
        </>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
