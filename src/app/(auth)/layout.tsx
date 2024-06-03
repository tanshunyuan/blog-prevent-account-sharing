import { type BaseChildrenProps } from "~/types/common";

export default function AuthLayout(props: BaseChildrenProps) {
  const { children } = props
  return <div className="h-screen flex items-center justify-center">
    {children}
  </div>

}