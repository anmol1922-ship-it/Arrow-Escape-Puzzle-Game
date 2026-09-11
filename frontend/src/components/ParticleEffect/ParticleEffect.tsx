export function ParticleEffect({ active }: { active: boolean }) {
  return active ? (
    <span className="particle-field" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  ) : null;
}
