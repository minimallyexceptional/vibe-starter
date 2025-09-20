import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ClerkLoaded, ClerkLoading, useSignUp } from '@/lib/clerk'
import { AlertCircle, CheckCircle2, MailCheck, UserPlus } from 'lucide-react'

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
import { Skeleton } from '@/components/ui/skeleton'
import { getClerkErrorMessage } from '@/lib/clerk'

const onboardingHighlights = [
  'Connect data sources in minutes with guided workflows',
  'Built-in analytics dashboards that update in real time',
  'Invite teammates and manage access with a single click',
]

export function SignUpRoute() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const navigate = useNavigate()
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [verificationCode, setVerificationCode] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null)

  const handleSignUp = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!isLoaded || !signUp) {
        return
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords must match before continuing.')
        return
      }

      setIsSubmitting(true)
      setErrorMessage(null)

      const trimmedName = fullName.trim()
      const [firstName, ...rest] = trimmedName.length ? trimmedName.split(/\s+/) : ['']
      const lastName = rest.length ? rest.join(' ') : undefined

      try {
        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName: firstName || undefined,
          lastName,
        })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          await navigate({ to: '/' })
          return
        }

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setPendingVerification(true)
        setInfoMessage(`We sent a verification code to ${email}. Enter it below to activate your account.`)
      } catch (error) {
        setErrorMessage(
          getClerkErrorMessage(error) ?? 'Something went wrong while creating your account. Please try again.',
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [confirmPassword, email, fullName, isLoaded, navigate, password, setActive, signUp],
  )

  const handleVerification = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!isLoaded || !signUp) {
        return
      }

      setIsSubmitting(true)
      setErrorMessage(null)

      try {
        const result = await signUp.attemptEmailAddressVerification({ code: verificationCode })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          await navigate({ to: '/' })
          return
        }

        setErrorMessage('We couldn\'t verify that code. Please try again.')
      } catch (error) {
        setErrorMessage(
          getClerkErrorMessage(error) ?? 'Something went wrong while verifying the code. Please try again.',
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [isLoaded, navigate, setActive, signUp, verificationCode],
  )

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
          <ClerkLoading>
            <div className="space-y-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {pendingVerification ? (
              <form className="space-y-5" onSubmit={handleVerification}>
                <div className="space-y-2 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-primary/10 p-1">
                      <MailCheck className="h-4 w-4" />
                    </span>
                    <p>{infoMessage}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-verification">Verification code</Label>
                  <Input
                    id="signup-verification"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errorMessage ? (
                  <div
                    className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <p>{errorMessage}</p>
                  </div>
                ) : null}
                <Button type="submit" className="w-full" disabled={isSubmitting || !verificationCode}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Verifying…' : 'Verify email'}
                </Button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSignUp}>
                <div className="grid gap-2">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input
                    id="signup-name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Work email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-confirm-password">Confirm password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errorMessage ? (
                  <div
                    className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <p>{errorMessage}</p>
                  </div>
                ) : null}
                <Button type="submit" className="w-full" disabled={isSubmitting || !isLoaded}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            )}
          </ClerkLoaded>
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
