"""
The minimax algorithm.
Copyright (c) 2022 falwat, under MIT License.
"""
import numpy as np
import abc
from enum import Enum
from numba import njit
from numba.typed import List


class Piece(Enum):
    """
    Piece Enum class.
    """
    black: int = 1
    white: int = 2

def check(board: np.ndarray, piece, row: int, col: int, pieces_in_line: int = 5):
    """
    Check for winning.
    Parameters
    ----------
    board : np.ndarray
        the game board.
    piece: Piece or int
        check for Piece.black or Piece.white, or the corresponding enum value.
    row : int
        row of last piece.
    col : int
        column of last piece.
    pieces_in_line : int
        pieces in line that winning. default is 5.
    Returns
    -------
    winning : bool
        True, the player won and the game over; 
        False, the player not won and the game continue.
    pos: tuple_of_int (row0, col0, row1, col1)
        when winning is True, pos mean position of pieces in line.
    """
    if isinstance(piece, Piece):
        value = piece.value
    else:
        value = piece
    row0: int = -1
    col0: int = -1
    row1: int = -1
    col1: int = -1
    winning = False
    for t in range(4):
        if winning:
            break
        if t == 0:
            # horizon
            line = board[row]
            rows = row * np.ones(board.shape[1])
            cols = np.arange(board.shape[0])
        elif t == 1:
            # vertical
            line = board[:, col]
            rows = np.arange(board.shape[0])
            cols = col * np.ones(board.shape[1])
        elif t == 2:
            # diagnal LU->RD
            line = np.diagonal(board, col - row)
            if row < col:
                rows = np.arange(len(line))
                cols = col - row + rows
            else:
                cols = np.arange(len(line))
                rows = row - col + cols
        elif t == 3:
            fliped_row = board.shape[0] - row - 1
            # dianal LD->RU
            line = np.diagonal(np.flipud(board),  col - fliped_row)
            if row + col <= board.shape[0]:
                cols = np.arange(len(line))
                rows = row + col - cols
            else:
                rows = np.arange(board.shape[0]-1, board.shape[0]-len(line)-1, -1)
                cols = row + col - rows
                # rows = fliped_row - col + cols
        count = 0
        for i, p in enumerate(line):
            if p == value:
                if count == 0:
                    row0 = rows[i]
                    col0 = cols[i]
                count += 1
                if count == pieces_in_line:
                    row1 = rows[i]
                    col1 = cols[i]
                    winning = True
                    break
            else:
                count = 0
    return winning, (row0, col0, row1, col1)


@njit
def check_value(board: np.ndarray, value: int, row: int, col: int, pieces_in_line: int = 5):
    """
    Check for winning.
    Parameters
    ----------
    board : np.ndarray
        the game board.
    value: int
        check for enum value of Piece.black or Piece.white.
    row : int
        row of last piece.
    col : int
        column of last piece.
    pieces_in_line : int
        pieces in line that winning. default is 5.
    Returns
    -------
    winning : bool
        True, the player won and the game over; 
        False, the player not won and the game continue.
    """
    winning = False
    for t in range(4):
        if winning:
            break
        if t == 0:
            # horizon
            line = board[row]
            rows = row * np.ones(board.shape[1])
            cols = np.arange(board.shape[0])
        elif t == 1:
            # vertical
            line = board[:, col]
            rows = np.arange(board.shape[0])
            cols = col * np.ones(board.shape[1])
        elif t == 2:
            # diagnal LU->RD
            offset = col - row
            line = np.diag(board, offset)
            if row < col:
                rows = np.arange(len(line))
                cols = col - row + rows
            else:
                cols = np.arange(len(line))
                rows = row - col + cols
        elif t == 3:
            fliped_row = board.shape[0] - row - 1
            # dianal LD->RU
            line = np.diag(np.flipud(board),  col - fliped_row)
            if row + col <= board.shape[0]:
                cols = np.arange(len(line))
                rows = row + col - cols
            else:
                rows = np.arange(board.shape[0]-1, board.shape[0]-len(line)-1, -1)
                cols = row + col - rows
                # rows = fliped_row - col + cols
        count = 0
        for i, p in enumerate(line):
            if p == value:
                count += 1
                if count == pieces_in_line:
                    winning = True
                    break
            else:
                count = 0
    return winning



class Agent(metaclass=abc.ABCMeta):
    def __init__(self, name: str, piece: Piece, **kwargs) -> None:
        """
        The Agent metaclass.
        Parameters
        ----------
        name: str
            player name.
        piece: Piece 
            The pieces used by the player. Piece.black or Piece.white
        """
        self.name = name
        self.piece = piece

    @abc.abstractmethod
    def play(self, board: np.ndarray, last_row: int = 0, last_col = 0, steps: int = 0):
        """
        parameters:
        -----------
        board: np.ndarray
            M by N array. 
        last_row: int
            the row of last play. [0, M)
        last_col: int
            the col of last play. [0, N)
        steps: int
            the step number from start game. begin with 0.
        returns:
        --------
        row, col: the next position of play.
        """
        pass

@njit
def indexes_union(board: np.ndarray, indexes: list, 
                    row: int, col: int, span: int = 1):
    row_lb = max(0, row - span)
    row_ub = min(board.shape[0], row + span + 1)
    col_lb = max(0, col - span)
    col_ub = min(board.shape[1], col + span + 1)
    section = board[row_lb:row_ub, col_lb:col_ub]
    row_r, col_r = np.nonzero(section==0)
    new_idxs = (row_r + row_lb) * board.shape[1] + (col_r + col_lb)
    union_indexes = indexes[:]
    for i in new_idxs:
        if i not in indexes:
            union_indexes.append(i)
    for i in range(len(union_indexes)):
        if union_indexes[i] == row * board.shape[1]  + col:
            del union_indexes[i]
            break
    return union_indexes

@njit
def indexes_union_init(board: np.ndarray, 
                    row: int, col: int, span: int = 1):
    row_lb = max(0, row - span)
    row_ub = min(board.shape[0], row + span + 1)
    col_lb = max(0, col - span)
    col_ub = min(board.shape[1], col + span + 1)
    section = board[row_lb:row_ub, col_lb:col_ub]
    row_r, col_r = np.nonzero(section==0)
    new_idxs = (row_r + row_lb) * board.shape[1] + (col_r + col_lb)
    union_indexes = List()
    for i in new_idxs:
        if i != row * board.shape[1]  + col:
            union_indexes.append(i)
    return union_indexes


@njit
def infer(piece: int, board: np.ndarray, indexes: set, 
        depth: int = 2):
    """
    depth: infer depth
    """
    ps = []
    for idx in indexes:
        row = idx // board.shape[1]
        col = idx % board.shape[0]
        board[row, col] = piece
        if check_value(board, piece, row, col) == True:
            ps.append(np.inf)
            board[row, col] = 0
            break
        elif depth > 1:
            oppnent_piece = Piece.black.value + Piece.white.value - piece
            new_indexes = indexes_union(board, indexes, row, col)
            p, r, c = infer(oppnent_piece, board, new_indexes, depth-1)
            ps.append(-p)
        else:
            ps.append(0)
        board[row, col] = 0
    ps = np.array(ps)
    i = np.random.choice(np.nonzero(ps == ps.max())[0])
    row = indexes[i] // board.shape[1]
    col = indexes[i] % board.shape[0]
    return ps[i], row, col


class Minimax(Agent):
    def __init__(self, name: str, piece: Piece, **kwargs) -> None:
        super().__init__(name, piece, **kwargs)
        if 'depth' in kwargs:
            self.depth = kwargs['depth']
        else:
            self.depth = 4
        self.indexes = List()

    def play(self, board: np.ndarray, last_row: int = 0, last_col=0, steps: int = 0):
        if steps == 0:
            self.indexes = List()
            row = board.shape[0] // 2
            col = board.shape[1] // 2
        elif steps == 1:
            self.indexes = indexes_union_init(board, last_row, last_col)
            p, row, col = infer(self.piece.value, board, self.indexes, depth=self.depth)
        else:
            self.indexes = indexes_union(board, self.indexes, last_row, last_col)
            p, row, col = infer(self.piece.value, board, self.indexes, depth=self.depth)
        board[row, col] = self.piece.value
        if len(self.indexes) == 0:
            self.indexes = indexes_union_init(board, row, col)
        else:
            self.indexes = indexes_union(board, self.indexes, row, col)
        return row, col





import sys
import json

# 获取 JavaScript 传递的两个数组
board = json.loads(sys.argv[1])
last_stone = json.loads(sys.argv[2])

steps = 0
for i in range(19):
    for j in range(19):
        if board[i][j] != 0:
            steps += 1

bot = Minimax('white', Piece.white, depth=4)
row, col = bot.play(board, last_stone[0], last_stone[1], steps)

print(json.dumps([row, col]))



onmessage = lambda event: postMessage(sum_arrays(event.data['arr1'], event.data['arr2']))