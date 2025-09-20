import * as React from 'react'
import type { StoryDefault } from '@ladle/react'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

export default {
  title: 'Components/Avatar',
} satisfies StoryDefault

export const Playground = () => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=80&q=80" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  )
}
