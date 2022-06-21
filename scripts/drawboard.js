/**
 * This file contains the boardSetup function that generates the initial board
 * setup.
 */

let board=null;


function boardSetup(){
    //TODO: Try fixing the size, make it responsive
    let h = window.innerHeight;
    let w = window.innerWidth;
    let dim = 0.9*w;
    if (h<w){
        dim = 0.9*h;
    }
    document.getElementById('board').style.height=(dim).toString()+'px';
    document.getElementById('board').style.width=(dim).toString()+'px';

    //config for the board
    let config = {
        draggable : true,
        dropOffBoard: 'snapback',
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop
    }

    //draw the board
    board = Chessboard('board',config);

}