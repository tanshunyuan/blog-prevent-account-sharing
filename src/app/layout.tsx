import { GeistSans } from "geist/font/sans";

import { type BaseChildrenProps } from "~/types/common";
import RootProvider from "~/utils/root-provider";

import "~/styles/globals.css";

export default function RootLayout(props: BaseChildrenProps) {
  const { children } = props
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
