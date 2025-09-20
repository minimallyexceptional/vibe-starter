import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm, useStore } from '@tanstack/react-form'
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
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null)

  const verificationForm = useForm({
    defaultValues: {
      code: '',
    },
    onSubmit: async ({ value }) => {
      if (!isLoaded || !signUp) {
        return
      }

      setErrorMessage(null)

      try {
        const result = await signUp.attemptEmailAddressVerification({ code: value.code })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          await navigate({ to: '/' })
          return
        }

        setErrorMessage("We couldn't verify that code. Please try again.")
      } catch (error) {
        setErrorMessage(
          getClerkErrorMessage(error) ??
            'Something went wrong while verifying the code. Please try again.',
        )
      }
    },
  })
  const verificationIsSubmitting = useStore(verificationForm.store, (state) => state.isSubmitting)
  const verificationCode = useStore(verificationForm.store, (state) => state.values.code)

  const signUpForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (!isLoaded || !signUp) {
        return
      }

      setErrorMessage(null)
      setInfoMessage(null)

      if (value.password !== value.confirmPassword) {
        setErrorMessage('Passwords must match before continuing.')
        return
      }

      const trimmedName = value.fullName.trim()
      const [firstName, ...rest] = trimmedName.length ? trimmedName.split(/\s+/) : ['']
      const lastName = rest.length ? rest.join(' ') : undefined

      try {
        const result = await signUp.create({
          emailAddress: value.email,
          password: value.password,
          firstName: firstName || undefined,
          lastName,
        })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          await navigate({ to: '/' })
          return
        }

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        verificationForm.reset()
        setPendingVerification(true)
        setInfoMessage(
          `We sent a verification code to ${value.email}. Enter it below to activate your account.`,
        )
      } catch (error) {
        setErrorMessage(
          getClerkErrorMessage(error) ??
            'Something went wrong while creating your account. Please try again.',
        )
      }
    },
  })
  const signUpIsSubmitting = useStore(signUpForm.store, (state) => state.isSubmitting)

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
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  void verificationForm.handleSubmit()
                }}
              >
                <div className="space-y-2 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-primary/10 p-1">
                      <MailCheck className="h-4 w-4" />
                    </span>
                    <p>{infoMessage}</p>
                  </div>
                </div>
                <verificationForm.Field name="code">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="signup-verification">Verification code</Label>
                      <Input
                        id="signup-verification"
                        name={field.name}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="123456"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        disabled={verificationIsSubmitting}
                        required
                      />
                    </div>
                  )}
                </verificationForm.Field>
                {errorMessage ? (
                  <div
                    className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <p>{errorMessage}</p>
                  </div>
                ) : null}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verificationIsSubmitting || !verificationCode}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {verificationIsSubmitting ? 'Verifying…' : 'Verify email'}
                </Button>
              </form>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  void signUpForm.handleSubmit()
                }}
              >
                <signUpForm.Field name="fullName">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="signup-name">Full name</Label>
                      <Input
                        id="signup-name"
                        name={field.name}
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        disabled={signUpIsSubmitting}
                        required
                      />
                    </div>
                  )}
                </signUpForm.Field>
                <signUpForm.Field name="email">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">Work email</Label>
                      <Input
                        id="signup-email"
                        name={field.name}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        disabled={signUpIsSubmitting}
                        required
                      />
                    </div>
                  )}
                </signUpForm.Field>
                <signUpForm.Field name="password">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name={field.name}
                        type="password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        disabled={signUpIsSubmitting}
                        required
                      />
                    </div>
                  )}
                </signUpForm.Field>
                <signUpForm.Field name="confirmPassword">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="signup-confirm-password">Confirm password</Label>
                      <Input
                        id="signup-confirm-password"
                        name={field.name}
                        type="password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        disabled={signUpIsSubmitting}
                        required
                      />
                    </div>
                  )}
                </signUpForm.Field>
                {errorMessage ? (
                  <div
                    className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <p>{errorMessage}</p>
                  </div>
                ) : null}
                <Button type="submit" className="w-full" disabled={signUpIsSubmitting || !isLoaded}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {signUpIsSubmitting ? 'Creating account…' : 'Create account'}
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
