# Sudoku Solver
A super simple Sudoku solver in TypeScript.

# How does it work?

Prerequisites: you have installed NodeJS and Typescript (`npm install -g typescript`)

* Check out the project
* Run `npm i`
* Run `tsc index.ts && node index.js`

# Concept

A Sudoku puzzle consists of a 9 x 9 grid. Each cell in the grid can contain a number ranging from 1 to 9.

|   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| 0 | B | B | B |   |   |   | C |   |   |
| 1 | B | B | B |   |   |   | C |   |   |
| 2 | B | B | B |   |   |   | C |   |   |
| 3 |   |   |   |   |   |   | C |   |   |
| 4 |   |   |   |   |   |   | C |   |   |
| 5 |   |   |   |   |   |   | C |   |   |
| 6 | R | R | R | R | R | R | RC | R  | R |
| 7 |   |   |   |   |   |   | C |   |   |
| 8 |   |   |   |   |   |   | C |   |   |

For an empty grid cell, a number is valid only if:

* it doesn't occur elsewhere in the same row
* it doesn't occur elsewhere in the same column
* it doesn't occur elsewhere in the same 3 x 3 block, of which there are 9 in total

This means that coordinate 2,2 can contain the number 1, and coordinate 3,1 can also contain the number 1.

# Solving

When a cell is empty, there are 9 possible numbers that can be put there. These are stored in an array, which is by default `[1, 2, 3, 4, 5, 6, 7, 8, 9]`.

The algorithm loops over each cell of the Sudoku square and attempts to reduce the number of possibilities.

In the following example, the number 3 is entered in the square.

|   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| 0 |   |   |   | B | B | B |   |   |   |
| 1 |   |   |   | B | B | B |   |   |   |
| 2 | R | R | R | B | 3 | B | R | R | R |
| 3 |   |   |   |   | C |   |   |   |   |
| 4 |   |   |   |   | C |   |   |   |   |
| 5 |   |   |   |   | C |   |   |   |   |
| 6 |   |   |   |   | C |   |   |   |   |
| 7 |   |   |   |   | C |   |   |   |   |
| 8 |   |   |   |   | C |   |   |   |   |

As a result, all arrays in the same row (marked with R) may now only consist of the 9 possibilities except for the number 3. 

This is repeated for each row; the row is copied from the original board, `map` is used to transform the value which in itself is an array, which in turns uses `filter` to remove the 3 from its list of possibilities.

The same operation is applied on the column level and the block level.

# Ambiguity

A Sudoku puzzle may have multiple solutions. In this case, the algorithm seeks out the smallest set of possibilities and picks the first possible value. The reason for choosing the smallest set is to eliminate the possibility of ending in a deadlock where the wrong value is guessed and the Sudoku puzzle can no longer be solved.

# Validation

Checking whether a solution is valid is done by validating that each value is unique, and that the sum of all values is 405; since each unique number from 1 to 9 appears 9 times

Implementing additional validation is left as an exercise to the reader.
