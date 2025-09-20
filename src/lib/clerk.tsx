import React from 'react'
import {
  ClerkLoaded as RealClerkLoaded,
  ClerkLoading as RealClerkLoading,
  ClerkProvider as RealClerkProvider,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  UserButton as RealUserButton,
  useClerk as realUseClerk,
  useSignIn as realUseSignIn,
  useSignUp as realUseSignUp,
  useUser as realUseUser,
} from '@clerk/clerk-react'

type ChildrenProps = { children?: React.ReactNode }

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const placeholderPattern = /yourClerkKeyHere/i

export const isClerkConfigured = Boolean(publishableKey && !placeholderPattern.test(publishableKey))
export const clerkMissingKeyMessage =
  'Clerk authentication is not configured. Set VITE_CLERK_PUBLISHABLE_KEY to a valid key to enable sign in.'

type SignInHookReturn = ReturnType<typeof realUseSignIn>
type SignUpHookReturn = ReturnType<typeof realUseSignUp>
type UseUserReturn = ReturnType<typeof realUseUser>
type UseClerkReturn = ReturnType<typeof realUseClerk>

const mockSignInValue = {
  isLoaded: true,
  signIn: {
    async create() {
      throw new Error(clerkMissingKeyMessage)
    },
  },
  setActive: async () => {},
} as unknown as SignInHookReturn

const mockSignUpValue = {
  isLoaded: true,
  signUp: {
    async create() {
      throw new Error(clerkMissingKeyMessage)
    },
    async prepareEmailAddressVerification() {
      return
    },
    async attemptEmailAddressVerification() {
      throw new Error(clerkMissingKeyMessage)
    },
  },
  setActive: async () => {},
} as unknown as SignUpHookReturn

const mockUseUserValue = {
  isLoaded: true,
  isSignedIn: true,
  user: {
    id: 'mock_user_id',
    firstName: 'Ada',
    lastName: 'Lovelace',
    fullName: 'Ada Lovelace',
    imageUrl: undefined,
    primaryEmailAddress: { emailAddress: 'ada@example.com' },
    emailAddresses: [{ emailAddress: 'ada@example.com' }],
  },
} as unknown as UseUserReturn

const mockClerkValue = {
  async signOut() {
    console.warn('signOut was called without an active Clerk instance. No action was taken.')
  },
} as unknown as UseClerkReturn

function MockClerkProvider(props: ChildrenProps) {
  return <>{props.children}</>
}

function MockClerkLoaded(props: ChildrenProps) {
  return <>{props.children}</>
}

function MockClerkLoading() {
  return null
}

function MockSignedIn() {
  return null
}

function MockSignedOut(props: ChildrenProps) {
  return <>{props.children}</>
}

function MockUserButton() {
  return null
}

function useMockSignIn(): SignInHookReturn {
  return React.useMemo(() => mockSignInValue, [])
}

function useMockSignUp(): SignUpHookReturn {
  return React.useMemo(() => mockSignUpValue, [])
}

function useMockUser(): UseUserReturn {
  return React.useMemo(() => mockUseUserValue, [])
}

function useMockClerk(): UseClerkReturn {
  return React.useMemo(() => mockClerkValue, [])
}

export function AppClerkProvider({ children }: ChildrenProps) {
  if (isClerkConfigured && publishableKey) {
    return (
      <RealClerkProvider
        publishableKey={publishableKey}
        appearance={{ variables: { colorPrimary: '#2563eb' } }}
      >
        {children}
      </RealClerkProvider>
    )
  }

  if (!publishableKey) {
    console.warn(
      'Missing VITE_CLERK_PUBLISHABLE_KEY. Using mock Clerk provider so the UI can render without authentication.',
    )
  } else if (!isClerkConfigured) {
    console.warn(
      'VITE_CLERK_PUBLISHABLE_KEY still contains the placeholder value. Update it with a real key to enable authentication.',
    )
  }

  return <MockClerkProvider>{children}</MockClerkProvider>
}

export const ClerkLoaded = isClerkConfigured ? RealClerkLoaded : MockClerkLoaded
export const ClerkLoading = isClerkConfigured ? RealClerkLoading : MockClerkLoading
export const SignedIn = isClerkConfigured ? RealSignedIn : MockSignedIn
export const SignedOut = isClerkConfigured ? RealSignedOut : MockSignedOut
export const UserButton = isClerkConfigured ? RealUserButton : MockUserButton
export const useSignIn = isClerkConfigured ? realUseSignIn : useMockSignIn
export const useSignUp = isClerkConfigured ? realUseSignUp : useMockSignUp
export const useUser = isClerkConfigured ? realUseUser : useMockUser
export const useClerk = isClerkConfigured ? realUseClerk : useMockClerk

export function getClerkErrorMessage(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const apiError = error as { errors?: Array<{ message?: string }> }
    const messages = apiError.errors?.map((item) => item?.message).filter(Boolean) as
      | string[]
      | undefined

    if (messages && messages.length > 0) {
      return messages.join(' ')
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return null
}
