import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  label: string;
}

export function IconButton({
  label,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={`icon-button ${className}`}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
