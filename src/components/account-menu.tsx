import * as React from 'react'
import { LogOut, Mail, Megaphone, Settings, ShieldAlert, ShieldCheck, User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useClerk, useUser } from '@/lib/clerk'

type CheckedState = boolean | 'indeterminate'

function toBooleanState(value: CheckedState) {
  return value === true
}

export function AccountMenu() {
  const { isLoaded, isSignedIn, user } = useUser()
  const clerk = useClerk()
  const [emailUpdates, setEmailUpdates] = React.useState(true)
  const [productAnnouncements, setProductAnnouncements] = React.useState(false)
  const [securityAlerts, setSecurityAlerts] = React.useState(true)

  const initials = React.useMemo(() => {
    if (!user) {
      return 'U'
    }

    if (user.firstName || user.lastName) {
      return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.trim().toUpperCase() || 'U'
    }

    const emailAddress =
      user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress

    return emailAddress?.[0]?.toUpperCase() ?? 'U'
  }, [user])

  const emailAddress = React.useMemo(() => {
    if (!user) {
      return ''
    }

    return user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? ''
  }, [user])

  const handleSignOut = React.useCallback(async () => {
    try {
      await clerk.signOut({ redirectUrl: '/' })
    } catch (error) {
      console.error('Unable to sign out of the current session.', error)
    }
  }, [clerk])

  if (!isLoaded || !isSignedIn || !user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.imageUrl ?? undefined} alt={user.fullName ?? 'Account avatar'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={user.imageUrl ?? undefined} alt={user.fullName ?? 'Account avatar'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-sm">
            <p className="font-semibold leading-none text-foreground">
              {user.fullName ?? 'Signed in user'}
            </p>
            {emailAddress ? <p className="text-xs text-muted-foreground">{emailAddress}</p> : null}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset>Account management</DropdownMenuLabel>
        <DropdownMenuItem className="flex-col items-start gap-0.5">
          <div className="flex w-full items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile overview
          </div>
          <p className="text-xs text-muted-foreground">Review your personal information.</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex-col items-start gap-0.5">
          <div className="flex w-full items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            Security center
          </div>
          <p className="text-xs text-muted-foreground">Manage passwords and sign-in methods.</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex-col items-start gap-0.5">
          <div className="flex w-full items-center gap-2 text-sm font-medium">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Billing preferences
          </div>
          <p className="text-xs text-muted-foreground">Update payment details and invoices.</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset>Notifications</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={emailUpdates}
          onCheckedChange={(value) => setEmailUpdates(toBooleanState(value))}
          className="flex-col items-start gap-0.5"
        >
          <div className="flex w-full items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email updates
          </div>
          <p className="text-xs text-muted-foreground">Receive a summary of product changes.</p>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={productAnnouncements}
          onCheckedChange={(value) => setProductAnnouncements(toBooleanState(value))}
          className="flex-col items-start gap-0.5"
        >
          <div className="flex w-full items-center gap-2 text-sm font-medium">
            <Megaphone className="h-4 w-4 text-muted-foreground" />
            Product announcements
          </div>
          <p className="text-xs text-muted-foreground">Get notified about early feature access.</p>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={securityAlerts}
          onCheckedChange={(value) => setSecurityAlerts(toBooleanState(value))}
          className="flex-col items-start gap-0.5"
        >
          <div className="flex w-full items-center gap-2 text-sm font-medium">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            Security alerts
          </div>
          <p className="text-xs text-muted-foreground">Important updates about account safety.</p>
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void handleSignOut()
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
