import React from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, UserPlus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const onboardingHighlights = [
  'Connect data sources in minutes with guided workflows',
  'Built-in analytics dashboards that update in real time',
  'Invite teammates and manage access with a single click',
]

export function SignUpRoute() {
  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }, [])

  return (
    <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.9fr,1.1fr]">
      <Card className="border-none bg-gradient-to-br from-secondary/20 via-background to-primary/15 shadow-lg">
        <CardHeader className="space-y-4 pb-6 md:pb-8">
          <Badge variant="secondary" className="w-fit bg-primary/80 text-primary-foreground">
            Get started today
          </Badge>
          <CardTitle className="text-2xl text-primary">Launch your next experience</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Create an account to unlock modern routing, data fetching, and polished UI primitives
            out of the box.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {onboardingHighlights.map((highlight) => (
            <div
              key={highlight}
              className="flex items-start gap-3 rounded-lg border border-primary/30 bg-background/80 p-4"
            >
              <span className="mt-1 rounded-full bg-primary/15 p-1 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <p>{highlight}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border-muted/60">
        <CardHeader className="space-y-3">
          <Badge variant="outline" className="w-fit border-primary/50 text-primary">
            Create account
          </Badge>
          <CardTitle className="text-3xl">Start building with TanStack</CardTitle>
          <CardDescription>
            Fill out the details below and we&apos;ll have you exploring data and shipping
            interfaces in no time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" autoComplete="name" placeholder="Ada Lovelace" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-email">Work email</Label>
              <Input
                id="signup-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" autoComplete="new-password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-confirm-password">Confirm password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p className="text-xs text-muted-foreground">
            By creating an account you agree to our{' '}
            <a className="underline" href="#">
              terms of service
            </a>{' '}
            and{' '}
            <a className="underline" href="#">
              privacy policy
            </a>
            .
          </p>
          <p>
            Already have an account?{' '}
            <Button variant="link" size="sm" className="h-auto px-0" asChild>
              <Link to="/login">Sign in instead</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
