let turn = 'w';


/**
 *
 * @param source the source of the piece being dragged
 * @param piece the piece being dragged
 * @param position the position of the board (FEN)
 * @param orientation current orientation of the board
 * @returns {boolean} true if valid color piece is dragged
 */
function onDragStart(source, piece, position, orientation){

    if ((orientation === 'white' && piece.search(/^w/) === -1) ||
        (orientation === 'black' && piece.search(/^b/) === -1)) {
        return false;
    }


}

function onDrop (source, target, piece, newPos, oldPos, orientation){
    console.log('Piece Dropped:');
    console.log(source);
    console.log(target);
    console.log('++++++++++++++');
    if (validate(source, target, piece, newPos, oldPos, orientation)){
        //TODO: Check if game is over

        if (orientation==='white') board.orientation('black');
        else board.orientation('white');
    }else{
        return 'snapback';
    }
}

function validate(){
    return false;
}