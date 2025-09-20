import * as React from 'react'
import type { StoryDefault } from '@ladle/react'
import { ChevronDown } from 'lucide-react'

import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu'

export default {
  title: 'Components/Dropdown Menu',
} satisfies StoryDefault

export const Playground = () => {
  const [emailAlerts, setEmailAlerts] = React.useState(true)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Actions
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Edit settings</DropdownMenuItem>
        <DropdownMenuCheckboxItem
          checked={emailAlerts}
          onCheckedChange={(next) => setEmailAlerts(next === true)}
        >
          Email notifications
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
