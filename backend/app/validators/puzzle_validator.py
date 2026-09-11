from ..schemas.puzzle import PuzzleSnapshot


def validate_snapshot(snapshot: PuzzleSnapshot) -> PuzzleSnapshot:
    for arrow in snapshot.arrows:
        if arrow.row >= snapshot.board_size or arrow.column >= snapshot.board_size:
            raise ValueError('arrow position is outside the board')
    return snapshot
