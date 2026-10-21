import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const dividerVariants = cva(
  `
    flex items-center justify-center `,
  {
    variants: {
      variant: {
        primary: "bg-blue-light",
        secondary: "bg-blue-base",
        tertiary: "bg-blue-base",
      },
      size: {
        md: "h-px my-2",
        sm: "h-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface DividerProps
  extends React.ComponentProps<"div">, VariantProps<typeof dividerVariants> {}

export default function Divider({
  variant,
  size,
  className,
  ...props
}: DividerProps) {
  return (
    <div
      className={dividerVariants({ variant, size, className })}
      {...props}
    ></div>
  );
}
