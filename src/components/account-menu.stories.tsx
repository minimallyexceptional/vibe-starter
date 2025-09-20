import * as React from 'react'
import type { StoryDefault } from '@ladle/react'

import { AppClerkProvider } from '@/lib/clerk'

import { AccountMenu } from './account-menu'

export default {
  title: 'Components/Account Menu',
} satisfies StoryDefault

export const Playground = () => {
  return (
    <AppClerkProvider>
      <div className="flex min-h-[200px] items-center justify-center bg-muted/40">
        <AccountMenu />
      </div>
    </AppClerkProvider>
  )
}
