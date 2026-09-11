import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function GameButton({
  children,
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`game-button ${className}`}
      type={props.type ?? "button"}
      {...props}
    >
      {children}
    </button>
  );
}
