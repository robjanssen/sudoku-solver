// initial board setup
const GRIDSIZE = 9;
const BLOCKSIZE = 3;

let board: number[][] = [
    [ ], [ ], [ ], [ ], [ ], [1], [2], [3], [ ], 
    [1], [2], [3], [ ], [ ], [8], [ ], [4], [ ], 
    [8], [ ], [4], [ ], [ ], [7], [6], [5], [ ], 
    [7], [6], [5], [ ], [ ], [ ], [ ], [ ], [ ], 
    [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
    [ ], [ ], [ ], [ ], [ ], [ ], [1], [2], [3], 
    [ ], [1], [2], [3], [ ], [ ], [8], [ ], [4], 
    [ ], [8], [ ], [4], [ ], [ ], [7], [6], [5], 
    [ ], [7], [6], [5], [ ], [ ], [ ], [ ], [ ], 
];

// an empty board with all options still wide open
// let board: number[][] = [
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
//   [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], 
// ];

// populate the board
let possibilities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
board = board.map((_) => (_.length === 0 ? possibilities : _));

// display
const display = (board: number[][]): void => {
  console.log(' ');
  for (let i = 0; i < GRIDSIZE; i++) {
    const c = toChunk(board, i, indexToRow).map(_ => _.join('').padEnd(9, ' ')).join("\t");
    console.log(c);
  }
};

// indexers - converts an array index to a row, column or block number (zero-based)
const indexToCol = (i: number): number => i % GRIDSIZE;
const indexToRow = (i: number): number => Math.floor(i / GRIDSIZE);
const indexToBlock = (i: number): number =>
  BLOCKSIZE * Math.floor(indexToRow(i) / BLOCKSIZE) + Math.floor(indexToCol(i) / BLOCKSIZE);

// converter - grabs the contents of a row, column or block
const toChunk = (board: number[][], index: number, method:(i: number) => number): number[][] =>
    board.filter((_, i) => method(i) === index);
  
// replacer - replaces a row, a column or a block
const replace = (
  board: number[][],
  chunk: number[][],
  index: number,
  method: (i: number) => number
): number[][] =>
  board.map((_, i) => (method(i) !== index ? _ : chunk.shift()!));

// solver
const solveChunk = (chunk: number[][]): number[][] => {
  const solved = chunk.filter((_) => _.length === 1).map((_) => _[0]);
  return chunk.map((_) =>
    _.length === 1 ? _ : _.filter((p) => solved.indexOf(p) === -1)
  );
};

// check whether a (partial) solution is valid
const isValid = (board:number[][]): boolean => {

  let valid = true;

  // a board is valid if each cell in a row has an unique number
  // for partially solved boards, cells with undetermined numbers don't count.
  [indexToRow, indexToCol, indexToBlock].forEach(indexer => {
      for(let i = 0; i < GRIDSIZE; i++){
      const row = toChunk(board, i, indexer).filter(_ => _.length === 1);
      let unique = Array.from(new Set(row))
      if(unique.length !== row.length){
        valid = false;
      }
    }
  });

  // a board where each cell only has a single number should have a sum of 9 x 1 + 9 x 2 + ... + 9 x 9 which is 405.
  if(board.filter(_ => _.length === 1).length === GRIDSIZE * GRIDSIZE){
    valid = Math.ceil(GRIDSIZE / 2) * GRIDSIZE * GRIDSIZE === board.map(_ => _[0]).reduce((acc, cur) => acc + cur, 0);
  }

  return valid;
}

// check whether a board is solved
const isSolved = (board: number[][]): boolean =>  !board.some((_) => _.length > 1);

// solve a board recursively. in the worst case, there are 66 iterations needed.
const solveRecursively = (board: number[][], iteration: number = 0): number[][] => {

  if(isSolved(board)){
    console.log(`This took ${iteration} iterations.`);
    return board;
  }

  return solveRecursively(solve(board), ++iteration);
};

// bring a board one step closer to a solution
const solve = (board: number[][]): number[][] => {
    // check how many are solved right now
    const before = board.filter((_) => _.length > 1).length;

    // run solvers

    [indexToRow, indexToCol, indexToBlock].forEach(indexer => {
      for (let i = 0; i < GRIDSIZE; i++) { 
        board = replace(board, solveChunk(toChunk(board, i, indexer)), i, indexer);
      }
    });
 
    const after = board.filter((_) => _.length > 1).length;

    // ambiguous solution - make a guess
    if (before === after) {
      let guess = false;

      // find the smallest list of possibilities (a list with the size of 1 is a certainty)   
      const smallest = board.map((_, x) => _.length).sort((l, r) => l - r).filter(_ => _ > 1).shift()!;
      
      board = board.map((_) => {
        if(!guess && _.length === smallest){
          guess = true;
          return [_[0]];
        }
        
        return _;
      });
    }
  
    return board;
  };


// solve the board using a while loop.
let iterations = 0;
while(!isSolved(board)){
  board = solve(board);
  iterations++;
}

console.log(`This took me ${iterations} iterations`);
display(board);

if(isValid(board)){
  console.log('this is a valid solution!');
}

// solve the board recursively
display(solveRecursively(board));

if(isValid(board)){
  console.log('this is a valid solution!');
}
