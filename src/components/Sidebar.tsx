import Dashboard from "../assets/icons/Dashboard.svg?react";
import TodosFunc from "../assets/icons/TodosFunc.svg?react";
import ContratosIcon from "../assets/icons/ContAtv.svg?react";
import { cva, type VariantProps } from "class-variance-authority";
import ButtonIcon from "./IconButton";
import { Link } from "react-router-dom";

export const sidebarVariants = cva(
  "fixed top-3 bottom-3 left-3 m-0 p-2 rounded shadow-lg z-30",
  {
    variants: {
      variant: {
        primary: "bg-blue-dark",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface SidebarProps
  extends VariantProps<typeof sidebarVariants>, React.ComponentProps<"aside"> {
  as?: keyof React.JSX.IntrinsicElements;
}

export default function Sidebar({
  variant,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside className={sidebarVariants({ variant, className })} {...props}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2">
          <Link to="/dashboard">
            <ButtonIcon
              icon={Dashboard}
              size={"md"}
              variant={"sidebar"}
              text={"Dashboard"}
            />
          </Link>
          <Link to="/employees">
            <ButtonIcon
              icon={TodosFunc}
              size={"md"}
              variant={"sidebar"}
              text={"Funcionários"}
            />
          </Link>
          <Link to="/contratos">
            <ButtonIcon
              icon={ContratosIcon}
              size={"md"}
              variant={"sidebar"}
              text={"Contratos"}
            />
          </Link>
          <Link to="/login">
            <ButtonIcon
              icon={ContratosIcon}
              size={"md"}
              variant={"sidebar"}
              text={"Login"}
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}
