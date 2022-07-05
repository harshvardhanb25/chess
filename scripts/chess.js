const COLUMNS = 'abcdefgh'.split('');
let enpTarget = null;
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
    // console.log('Piece Dropped:');
    // console.log(source);
    // console.log(target);
    // console.log(oldPos);
    // console.log('++++++++++++++');
    if (validate(source, target, piece, newPos, oldPos, orientation)){
        //TODO: Check if game is over

        if (orientation==='white') board.orientation('black');
        else board.orientation('white');
        //TODO: for testing REMOVE
        // sqCheck('e8', newPos, 'b');
        // sqCheck('e1',newPos, 'w');
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

    if (valFunc(source, target, piece, newPos, oldPos, orientation)){
        return !sqCheck(findKing(newPos, turn),newPos,turn);
    }
    return false;
    // if (oldPos[target]===undefined){
    //     return valFunc(source, target, piece, newPos, oldPos, orientation);
    // }else if(!oldPos[target].startsWith(turn)){
    //     return valFunc(source, target, piece, newPos, oldPos, orientation);
    // }

}

/**
 * Helper function for computeFunction. Adds the square to the moves
 * array if square is reachable and does not contain a piece of the
 * same color.
 * @param color the color of the piece to move
 * @param moves the array containing reachable squares
 * @param position the current position of the board
 * @param row the row of the square to check
 * @param colIdx the column index of the square to check
 * @return {number} 0 if there is no piece on the square. 1 otherwise.
 */
function computeHelp(color, moves, position, row, colIdx){
    let square = COLUMNS[colIdx]+row;

    if (position[square]===undefined){
        //square is empty
        moves.push(square);
        return 1;
    }else if(!position[square].startsWith(color)){
        //square has opponent's piece
        moves.push(square);
    }
    return 0;
}
/**
 * Helper function to compute diagonal squares from a given square.
 * Used for computing moves for queens and bishops
 * @param source the source square
 * @return {*[]} Array containing squares diagonal to the source square
 */

function computeDiagonal(source, piece, position){
    let row = parseInt(source.split('')[1]);
    let colIdx = COLUMNS.indexOf(source.split('')[0]);
    let moves = [];
    let color = piece.split('')[0];

    let valid = [1,1,1,1]

    for (let diff=1; diff<=7; diff++){
        if (row+diff<=8){
            if (colIdx+diff<=7 && valid[0]){
                valid[0] = computeHelp(color, moves, position, row+diff, colIdx+diff);
            }
            if (colIdx-diff>=0 && valid[1]){
                valid[1] = computeHelp(color, moves, position, row+diff, colIdx-diff);
            }
        }

        if (row-diff>=1){
            if (colIdx+diff<=7 && valid[2]){
                valid[2] = computeHelp(color, moves, position, row-diff, colIdx+diff);
            }
            if (colIdx-diff>=0 && valid[3]){
                valid[3] = computeHelp(color, moves, position, row-diff, colIdx-diff);
            }
        }
    }
    // for (let diff=1; diff<=7; diff++){
    //     if (row+diff<=8){
    //         if (colIdx+diff<=7) moves.push(COLUMNS[colIdx+diff]+(row+diff));
    //         if (colIdx-diff>=0) moves.push(COLUMNS[colIdx-diff]+(row+diff));
    //     }
    //     if (row-diff>=1){
    //         if (colIdx+diff<=7) moves.push(COLUMNS[colIdx+diff]+(row-diff));
    //         if (colIdx-diff>=0) moves.push(COLUMNS[colIdx-diff]+(row-diff));
    //     }
    // }

    return moves;
}

/**
 * Helper function to compute the straight path used for computing
 * moves for queens and rooks.
 * @param source the source square
 * @param piece the piece being checked for
 * @param position the position of the board
 * @return {*[]} array of possible squares
 */
function computeStraight(source, piece, position){
    let row = parseInt(source.split('')[1]);
    let col = source.split('')[0];
    let colIdx = COLUMNS.indexOf(col)
    let color = piece.split('')[0];
    let moves = [];

    for (let r = row-1; r>=1; r--){
        moves.push(col+r);
        let pSq = position[col+r];
        if (pSq!==undefined){
            if (pSq.startsWith(color)) moves.pop();
            break;
        }
    }

    for (let r = row+1; r<=8; r++){
        moves.push(col+r);
        let pSq = position[col+r];
        if (pSq!==undefined){
            if (pSq.startsWith(color)) moves.pop();
            break;
        }
    }

    for (let c=colIdx-1; c>=0; c--){
        moves.push(COLUMNS[c]+row);
        let pSq = position[COLUMNS[c]+row];
        if (pSq!==undefined){
            if (pSq.startsWith(color)) moves.pop();
            break;
        }
    }

    for (let c=colIdx+1; c<=7; c++){
        moves.push(COLUMNS[c]+row);
        let pSq = position[COLUMNS[c]+row];
        if (pSq!==undefined){
            if (pSq.startsWith(color)) moves.pop();
            break;
        }
    }

    return moves;
}

//TODO: Write functions to compute all possible moves for each piece
//TODO: fix computeKing and computeKnight to remove invalid moves

/**
 * Computes all the squares a king might go to, without looking at any
 * other factors.
 * @param source current position of the king
 * @returns {*[]} Array containing all possible squares
 */
function computeKing(source, piece, position){
    //TODO: Add castling
    let row = parseInt(source.split('')[1]);
    let colIdx = COLUMNS.indexOf(source.split('')[0]);
    let moves = [];
    let color = piece.split('')[0]

    //computes all possible squares in the row above and below the piece
    for (let r of [row-1,row+1]){
        for (let c of [colIdx-1,colIdx,colIdx+1]){
            if (r>=1 && r<=8 && c>=0 && c<=7){
                computeHelp(color, moves, position, r, c);
            }
        }
    }
    //same row, columns to left and right
    for (let c of [colIdx-1,colIdx+1]){
        if (c>=0 && c<=7){
            computeHelp(color, moves, position, row, c);
        }
    }

    // console.log("All possible moves for king:")
    // console.log(moves);
    // console.log('+++++++++++++++++++++')
    return moves;
}


/**
 * Computes all possible squares where the knight might go.
 * @param source current position of the knight
 * @returns {*[]} Array containing all possible squares
 */
function computeKnight(source, piece, position){
    let row = parseInt(source.split('')[1]);
    let colIdx = COLUMNS.indexOf(source.split('')[0]);
    let moves = [];
    let color = piece.split('')[0]

    //Longer step along rows
    for (let r of [row-2,row+2]){
        for (let c of [colIdx-1,colIdx+1]){
            if (r>=1 && r<=8 && c>=0 && c<=7){
                computeHelp(color, moves, position, r, c);
            }
        }
    }

    //Longer step along columns
    for (let r of [row-1,row+1]){
        for (let c of [colIdx-2,colIdx+2]){
            if (r>=1 && r<=8 && c>=0 && c<=7){
                computeHelp(color, moves, position, r, c);
            }
        }
    }
    // console.log("All possible moves for knight:")
    // console.log(moves);
    // console.log('+++++++++++++++++++++')
    return moves;
}

function computeBishop(source, piece, position){
    let moves = computeDiagonal(source, piece, position);
    // console.log("All possible moves for Bishop:")
    // console.log(moves);
    // console.log('+++++++++++++++++++++')
    return moves;
}

function computeRook(source, piece, position){
    let moves = computeStraight(source, piece, position);
    // console.log("All possible moves for Rook:");
    // console.log(moves);
    // console.log('+++++++++++++++++++++');
    return moves;
}


function computeQueen(source, piece, position){
    let moves = computeStraight(source, piece, position);
    moves = moves.concat(computeDiagonal(source,piece, position));
    // console.log("All possible moves for queen:");
    // console.log(moves);
    // console.log('+++++++++++++++++++++');
    return moves;
}


function computePawn(source, piece, position){
    //TODO: Add en passant
    let color = piece.split('')[0];
    let row = parseInt(source.split('')[1]);
    let col = source.split('')[0];
    let colIdx = COLUMNS.indexOf(col);
    let moves = [];

    let dir = 1; //for switching direction based on color of piece

    if (color==='b')  dir = -1;

    if (position[col+(row+dir)]===undefined){
        moves.push(col+(row+dir));
        if (position[col+(row+2*dir)]===undefined){
            if ((color==='w' && row===2) || (color==='b' && row===7)) moves.push(col+(row+2*dir));
        }
    }

    for (let diff of [-1,1]){
        let targetSq = COLUMNS[colIdx+diff]+(row+dir)
        let targetPc = position[targetSq];
        if (targetPc!==undefined){
            if (!targetPc.startsWith(color)) moves.push(targetSq);
        }
    }
    // console.log('All possible moves for pawn:');
    // console.log(moves);
    // console.log('+++++++++++++++++++++++')
    return moves;
}


function computeDet(source, piece, position){
    let compFunc=computePawn;
    if (piece.search(/K$/)!==-1) compFunc = computeKing;
    else if(piece.search(/Q$/)!==-1) compFunc = computeQueen;
    else if(piece.search(/N$/)!==-1) compFunc = computeKnight;
    else if (piece.search(/B$/)!==-1) compFunc = computeBishop;
    else if (piece.search(/R$/)!==-1) compFunc = computeRook;
    return compFunc(source,piece,position);
}

//TODO: Implement individual validation functions
//TODO: Check if newPos will be in check if initial move check passes
function validateKing(source, target, piece, newPos, oldPos, orientation){
    if (computeKing(source,piece,oldPos).includes(target)) return true;
    return false;
}
function validateKnight(source, target, piece, newPos, oldPos, orientation){
    if (computeKnight(source,piece,oldPos).includes(target)) return true;
    return false;
}

function validateQueen(source, target, piece, newPos, oldPos, orientation){
    if (computeQueen(source, piece, oldPos).includes(target)) return true;
    return false;
}

function validateBishop(source, target, piece, newPos, oldPos, orientation){
    if (computeBishop(source, piece, oldPos).includes(target)) return true;
    return false;
}
function validateRook(source, target, piece, newPos, oldPos, orientation){
    if (computeRook(source,piece,oldPos).includes(target)) return true;
    return false;
}

function validatePawn(source, target, piece, newPos, oldPos, orientation){
    if (computePawn(source,piece,oldPos).includes(target)) return true;
    return false;
}


/**
 * returns the square where the king of the color provided by the color parameter
 * is currently present.
 * @param position position on the board
 * @param color the color of the king to find
 * @return {string} the king's current position
 */
function findKing(position, color){
    let king = color+'K';
    for (let square in position){
        if (position[square]===king) return square;
    }

}


//TODO: Test
/**
 * Determines if a square is under attack from the other color. Uses the compute
 * functions on all enemy pieces until apiece attacking the square is found.
 * @param square the square to check
 * @param position the position of the board
 * @param color the current player's color char ('w' or 'b')
 * @return {boolean} true if square is under attack, false otherwise
 */
function sqCheck(square, position, color){
    console.log('');
    for (let sq in position){
        if (position[sq].charAt(0)!==color) {
            if (computeDet(sq, position[sq], position).includes(square)){
                console.log(position[square]+'is in check by '+position[sq]);
                console.log('$$$$$$$$$$$$$$$');
                return true;
            }
        }
    }
    return false
}


