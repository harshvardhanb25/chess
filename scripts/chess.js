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
    console.log(oldPos);
    console.log('++++++++++++++');
    if (validate(source, target, piece, newPos, oldPos, orientation)){
        //TODO: Check if game is over

        if (orientation==='white') board.orientation('black');
        else board.orientation('white');
    }else{
        return 'snapback';
    }
}

function validate(source, target, piece, newPos, oldPos, orientation){

    if (target==='offboard') return false;

    let turn='w';
    if (piece.search(/^b/)!== -1) turn = 'b';

    //Determine piece type and store function pointer for the validation function
    let valFunc=validatePawn;
    if (piece.search(/K$/)!==-1) valFunc = validateKing;
    else if(piece.search(/Q$/)!==-1) valFunc = validateQueen;
    else if(piece.search(/N$/)!==-1) valFunc = validateKnight;
    else if (piece.search(/B$/)!==-1) valFunc = validateBishop;
    else if (piece.search(/R$/)!==-1) valFunc = validateRook;

    if (oldPos[target]===undefined){
        return valFunc(source, target, piece, newPos, oldPos, orientation);
    }else if(!oldPos[target].startsWith(turn)){
        return valFunc(source, target, piece, newPos, oldPos, orientation);
    }

}

//TODO Write functions to compute all possible moves for each piece


//TODO: Implement individual validation functions
function validateKing(source, target, piece, newPos, oldPos, orientation){
    return true;
}
function validateKnight(source, target, piece, newPos, oldPos, orientation){}
function validateQueen(source, target, piece, newPos, oldPos, orientation){}
function validateBishop(source, target, piece, newPos, oldPos, orientation){}
function validateRook(source, target, piece, newPos, oldPos, orientation){}
function validatePawn(source, target, piece, newPos, oldPos, orientation){
    return true;
}


