import { type BaseChildrenProps } from "~/types/common";
import { AppProvider } from "~/utils/app-provider";

export default function AppLayout(props: BaseChildrenProps) {
  const { children } = props;
  return <AppProvider>{children}</AppProvider>;
}
