const COLUMNS = 'abcdefgh'.split('');

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


/**
 * Helper function to compute diagonal squares from a given square.
 * Used for computing moves for queens and bishops
 * @param source the source square
 * @return {*[]} Array containing squares diagonal to the source square
 */

function computeDiagonal(source){
    let row = parseInt(source.split('')[1]);
    let colIdx = COLUMNS.indexOf(source.split('')[0]);
    let moves = [];

    for (let diff=1; diff<=7; diff++){
        if (row+diff<=8){
            if (colIdx+diff<=7) moves.push(COLUMNS[colIdx+diff]+(row+diff));
            if (colIdx-diff>=0) moves.push(COLUMNS[colIdx-diff]+(row+diff));
        }
        if (row-diff>=1){
            if (colIdx+diff<=7) moves.push(COLUMNS[colIdx+diff]+(row-diff));
            if (colIdx-diff>=0) moves.push(COLUMNS[colIdx-diff]+(row-diff));
        }
    }
    // for (let r = row; r<=8; r++){
    //     for (let c = colIdx; c<=7; c++){
    //         moves.push(COLUMNS[c]+r);
    //     }
    //     for (let c = colIdx; c>=0; c--){
    //         moves.push(COLUMNS[c]+r);
    //     }
    // }
    //
    // for (let r = row; r>=1; r--){
    //     for (let c = colIdx; c<=7; c++){
    //         moves.push(COLUMNS[c]+r);
    //     }
    //     for (let c = colIdx; c>=0; c--){
    //         moves.push(COLUMNS[c]+r);
    //     }
    // }

    return moves;
}


//TODO Write functions to compute all possible moves for each piece

/**
 * Computes all the squares a king might go to, without looking at any
 * other factors.
 * @param source current position of the king
 * @returns {*[]} Array containing all possible squares
 */
function computeKing(source){
    let row = parseInt(source.split('')[1]);
    let colIdx = COLUMNS.indexOf(source.split('')[0]);
    let moves = [];

    //computes all possible squares in the row above and below the piece
    for (let r of [row-1,row+1]){
        for (let c of [colIdx-1,colIdx,colIdx+1]){
            if (r>=1 && r<=8 && c>=0 && c<=7){
                moves.push(COLUMNS[c]+r);
            }
        }
    }
    //same row, columns to left and right
    for (let c of [colIdx-1,colIdx+1]){
        if (c>=0 && c<=7){
            moves.push(COLUMNS[c]+row);
        }
    }
    console.log("All possible moves for king:")
    console.log(moves);
    console.log('+++++++++++++++++++++')
    return moves;
}


/**
 * Computes all possible squares where the knight might go.
 * @param source current position of the knight
 * @returns {*[]} Array containing all possible squares
 */
function computeKnight(source){
    let row = parseInt(source.split('')[1]);
    let colIdx = COLUMNS.indexOf(source.split('')[0]);
    let moves = [];

    //Longer step along rows
    for (let r of [row-2,row+2]){
        for (let c of [colIdx-1,colIdx+1]){
            if (r>=1 && r<=8 && c>=0 && c<=7){
                moves.push(COLUMNS[c]+r);
            }
        }
    }

    //Longer step along columns
    for (let r of [row-1,row+1]){
        for (let c of [colIdx-2,colIdx+2]){
            if (r>=1 && r<=8 && c>=0 && c<=7){
                moves.push(COLUMNS[c]+r);
            }
        }
    }
    console.log("All possible moves for knight:")
    console.log(moves);
    console.log('+++++++++++++++++++++')
    return moves;
}

function computeBishop(source){
    let moves = computeDiagonal(source);
    console.log("All possible moves for Bishop:")
    console.log(moves);
    console.log('+++++++++++++++++++++')
}

//TODO: Implement individual validation functions
function validateKing(source, target, piece, newPos, oldPos, orientation){
    computeKing(source);
    return true;
}
function validateKnight(source, target, piece, newPos, oldPos, orientation){
    computeKnight(source);
    return true;
}

function validateQueen(source, target, piece, newPos, oldPos, orientation){}

function validateBishop(source, target, piece, newPos, oldPos, orientation){
    computeBishop(source);
    return true;
}
function validateRook(source, target, piece, newPos, oldPos, orientation){}
function validatePawn(source, target, piece, newPos, oldPos, orientation){
    return true;
}

//TODO: implement a function to check if a given square is in check by opposite color


