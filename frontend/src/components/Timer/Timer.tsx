export function Timer({ seconds }: { seconds: number }) {
  return (
    <span aria-label={`Elapsed time ${seconds} seconds`}>
      {String(seconds).padStart(2, "0")}s
    </span>
  );
}
