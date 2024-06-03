
import {
  ClerkProvider,
} from '@clerk/nextjs'

import { type BaseChildrenProps } from '~/types/common'
import { TRPCReactProvider } from '~/trpc/react'

import "~/styles/globals.css";
import { Toaster } from 'react-hot-toast';

export default function RootProvider(props: BaseChildrenProps) {
  const { children } = props
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <Toaster />
        {children}
      </TRPCReactProvider>
    </ClerkProvider>
  )
}