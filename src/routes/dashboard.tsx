import React from 'react'
import { Link, Navigate, Outlet, useRouterState } from '@tanstack/react-router'
import { BarChart3, ChevronLeft, ChevronRight, LayoutDashboard, Menu, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ModeToggle } from '@/components/mode-toggle'
import { SignedIn, SignedOut, UserButton, isClerkConfigured } from '@/lib/clerk'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    label: 'Counter',
    description: 'Track interactions in real time.',
    to: '/dashboard/counter',
    icon: LayoutDashboard,
  },
  {
    label: 'Hello world',
    description: 'Quick status update view.',
    to: '/dashboard/hello',
    icon: Sparkles,
  },
] as const

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const pathname = useRouterState({ select: (state) => state.location.pathname ?? '/' })
  const authEnabled = isClerkConfigured

  const activeItem = React.useMemo(
    () => sidebarItems.find((item) => pathname.startsWith(item.to)),
    [pathname],
  )

  const baseNavItemClass = React.useMemo(
    () =>
      cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted',
        isCollapsed ? 'justify-center px-2' : 'justify-start',
      ),
    [isCollapsed],
  )

  const activeNavItemClass = React.useMemo(
    () => cn(baseNavItemClass, 'bg-primary/10 text-primary hover:bg-primary/10'),
    [baseNavItemClass],
  )

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-10 bg-background/60 backdrop-blur-sm transition-opacity md:hidden',
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsMobileOpen(false)}
      />
      <div className="flex h-screen min-h-[100dvh] bg-background">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-20 flex h-full w-64 min-h-0 flex-col border-r bg-card transition-[transform,width] duration-300 md:static md:translate-x-0',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            isCollapsed && 'md:w-20',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span className={cn('text-base font-semibold', isCollapsed && 'sr-only')}>
                Control Center
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={baseNavItemClass}
                  onClick={() => setIsMobileOpen(false)}
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: activeNavItemClass,
                    'aria-current': 'page',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className={cn('whitespace-nowrap', isCollapsed && 'sr-only')}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          <div className="border-t px-4 py-4 text-xs text-muted-foreground">
            <p className={cn('font-medium text-foreground', isCollapsed && 'sr-only')}>
              Signed in tools
            </p>
            <p className={cn(isCollapsed && 'sr-only')}>
              Use the sidebar to switch between workspace modules.
            </p>
          </div>
        </aside>
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden md:pl-0">
          <header className="flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileOpen((prev) => !prev)}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Dashboard</p>
                <h1 className="text-lg font-semibold text-foreground">
                  {activeItem?.label ?? 'Workspace overview'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeItem?.description ?? 'Select a module from the sidebar to get started.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <SignedIn>
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: 'h-9 w-9' } }}
                  afterSignOutUrl="/"
                />
              </SignedIn>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {authEnabled ? (
              <>
                <SignedIn>
                  <Outlet />
                </SignedIn>
                <SignedOut>
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <LayoutDashboard className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        Sign in to view your dashboard
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        You need to be authenticated to explore the workspace modules and analytics.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button asChild>
                        <Link to="/login">Log in</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/sign-up">Create an account</Link>
                      </Button>
                    </div>
                  </div>
                </SignedOut>
              </>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export function DashboardCounterRoute() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Interactive counter
        </h2>
        <p className="text-sm text-muted-foreground">
          Use the buttons below to increment, decrement, or reset the counter value.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Counter value</CardTitle>
          <CardDescription>The current count reflects your latest interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <span className="text-6xl font-bold tracking-tight text-primary">{count}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => setCount((value) => value - 1)}>
            Decrease
          </Button>
          <Button onClick={() => setCount((value) => value + 1)}>Increase</Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function DashboardHelloRoute() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hello world</CardTitle>
          <CardDescription>Welcome to your personalized space.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This page demonstrates how navigation within the dashboard shell swaps the content that
            appears in the main work area.
          </p>
          <p>Feel free to extend this view with additional widgets, charts, or team updates.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardIndexRoute() {
  return <Navigate to="/dashboard/counter" replace />
}
