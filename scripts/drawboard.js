/**
 * This file contains the boardSetup function that generates the initial board
 * setup.
 */

let board;


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
    console.log(w);
    console.log(h);

    //config for the board
    let config = {
        draggable : true,
        dropOffBoard: 'snapback',
        position: 'start'
    }

    //draw the board
    board = Chessboard('board',config);

}