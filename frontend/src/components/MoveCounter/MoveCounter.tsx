export function MoveCounter({
  moves,
  target,
}: {
  moves: number;
  target: number;
}) {
  return (
    <span aria-label={`${moves} of ${target} moves`}>
      {moves}/{target}
    </span>
  );
}
