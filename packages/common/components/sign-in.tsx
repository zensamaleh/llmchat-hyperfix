import { useSignIn, useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from '@repo/ui';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
type CustomSignInProps = {
    redirectUrl?: string;
    onClose?: () => void;
};

export const CustomSignIn = ({
    redirectUrl = '/sign-in/sso-callback',
    onClose,
}: CustomSignInProps) => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const { signIn, isLoaded, setActive } = useSignIn();
    const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
    const [code, setCode] = useState('');
    const [resending, setResending] = useState(false);
    if (!isSignUpLoaded || !isLoaded) return null;
    const router = useRouter();

    const handleVerify = async () => {
        // Check if code is complete
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading('verify');
        try {
            if (!isLoaded || !signIn) return;
            const result = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (result.status === 'complete') {
                setActive({ session: result.createdSessionId });
                router.push('/chat');
            }
        } catch (error: any) {
            console.log(error.errors);
            if (error.errors && error.errors.some((e: any) => e.code === 'client_state_invalid')) {
                try {
                    const result = await signIn.attemptFirstFactor({
                        strategy: 'email_code',
                        code,
                    });

                    if (result.status === 'complete') {
                        setActive({ session: result.createdSessionId });
                        router.push('/chat');
                    }
                } catch (error) {
                    if (isClerkAPIResponseError(error)) {
                        console.log(error);
                    }

                    console.error('Sign-in error:', error);
                    setError('Something went wrong while signing in. Please try again.');
                }
            } else {
                console.error('Verification error:', error);
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading('google');

        try {
            if (!isLoaded || !signIn) return;
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl,
                redirectUrlComplete: redirectUrl,
            });
        } catch (error) {
            console.error('Google authentication error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleGithubAuth = async () => {
        setIsLoading('github');

        try {
            if (!isLoaded || !signIn) return;
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_github',
                redirectUrl,
                redirectUrlComplete: redirectUrl,
            });
        } catch (error) {
            console.error('GitHub authentication error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleAppleAuth = async () => {
        setIsLoading('apple');

        try {
            if (!isLoaded || !signIn) return;
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_apple',
                redirectUrl,
                redirectUrlComplete: redirectUrl,
            });
        } catch (error) {
            console.error('Apple authentication error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailAuth = async () => {
        setIsLoading('email');
        setError('');

        if (!email) {
            setError('Email is required');
            setIsLoading(null);
            return;
        } else if (!validateEmail(email)) {
            setError('Please enter a valid email');
            setIsLoading(null);
            return;
        }

        try {
            // Try signing up the user first
            await signUp.create({ emailAddress: email });

            // If sign-up is successful, send the magic link
            const protocol = window.location.protocol;
            const host = window.location.host;
            const fullRedirectUrl = `${protocol}//${host}${redirectUrl}`;

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            setVerifying(true);
        } catch (error: any) {
            if (
                error.errors &&
                error.errors.some((e: any) => e.code === 'form_identifier_exists')
            ) {
                try {
                    // If the user already exists, sign them in instead
                    const signInAttempt = await signIn.create({
                        identifier: email,
                    });

                    console.log(signInAttempt);

                    // Get the email address ID from the response and prepare the magic link
                    const emailAddressIdObj: any = signInAttempt?.supportedFirstFactors?.find(
                        (factor: any) => factor.strategy === 'email_code'
                    );

                    const emailAddressId: any = emailAddressIdObj?.emailAddressId || '';

                    if (emailAddressId) {
                        await signIn.prepareFirstFactor({
                            strategy: 'email_code',
                            emailAddressId,
                        });

                        setVerifying(true);
                    } else {
                        throw new Error('Email address ID not found');
                    }
                } catch (error: any) {
                    console.log(error.message);
                    if (error.includes('Incorrect code')) {
                        setError('Incorrect code. Please try again.');
                    } else {
                        console.error('Sign-in error:', error);
                        setError('Something went wrong while signing in. Please try again.');
                    }
                }
            } else {
                console.error('Authentication error:', error);
                setError(
                    error?.errors?.[0]?.longMessage || 'Authentication failed. Please try again.'
                );
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handleSendCode = async () => {
        // Don't proceed if already resending
        if (resending) return;

        // Check if email is available
        if (!email) {
            setError('Email is missing. Please try again.');
            return;
        }

        setResending(true);
        setError('');

        try {
            // First try with signUp flow
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            // Show a success message
            setError('');
        } catch (error: any) {
            // If error, try with signIn flow
            if (error.errors && error.errors.some((e: any) => e.code === 'client_state_invalid')) {
                try {
                    const signInAttempt = await signIn.create({
                        identifier: email,
                    });

                    const emailAddressIdObj: any = signInAttempt?.supportedFirstFactors?.find(
                        (factor: any) => factor.strategy === 'email_code'
                    );

                    const emailAddressId: any = emailAddressIdObj?.emailAddressId || '';

                    if (emailAddressId) {
                        await signIn.prepareFirstFactor({
                            strategy: 'email_code',
                            emailAddressId,
                        });
                    } else {
                        throw new Error('Email address ID not found');
                    }
                } catch (error) {
                    if (isClerkAPIResponseError(error)) {
                        console.error('Error resending code:', error);
                    }
                    setError('Failed to resend code. Please try again.');
                }
            } else {
                console.error('Error resending code:', error);
                setError('Failed to resend code. Please try again.');
            }
        } finally {
            // Wait a moment before allowing another resend (to prevent spam)
            setTimeout(() => {
                setResending(false);
            }, 3000);
        }
    };

    if (verifying) {
        return (
            <div className="flex w-[300px] flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                    <h2 className="font-clash text-foreground !text-brand text-center text-[24px] font-semibold leading-tight">
                        Check your email
                    </h2>
                    <p className="text-muted-foreground text-center text-sm">
                        We've sent a code to your email. Please check your inbox and enter the code
                        to continue.
                    </p>
                </div>
                <InputOTP
                    maxLength={6}
                    autoFocus
                    value={code}
                    onChange={setCode}
                    onComplete={handleVerify}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <p className="text-muted-foreground text-center text-sm">
                    Didn't receive an email?{' '}
                    <span
                        className={`hover:text-brand text-brand cursor-pointer underline ${
                            resending ? 'pointer-events-none opacity-70' : ''
                        }`}
                        onClick={handleSendCode}
                    >
                        {resending ? 'Sending...' : 'Resend Code'}
                    </span>
                </p>

                <div id="clerk-captcha"></div>
                <div className="text-muted-foreground text-center text-sm">
                    {error && <p className="text-rose-400">{error}</p>}
                    {resending && <p className="text-brand">Sending verification code...</p>}
                </div>
            </div>
        );
    }

    return (
        <>
            <Button
                onClick={() => {
                    onClose?.();
                }}
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-2"
            >
                <IconX className="h-4 w-4" />
            </Button>
            <div className="flex w-[320px] flex-col items-center gap-8">
                <h2 className="text-muted-foreground/70 text-center text-[24px] font-semibold leading-tight">
                    Sign in to unlock <br /> advanced research tools
                </h2>

                <div className="flex w-[300px] flex-col space-y-1.5">
                    <Button
                        onClick={handleGoogleAuth}
                        disabled={isLoading === 'google'}
                        variant="bordered"
                    >
                        {isLoading === 'google' ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                            <FaGoogle className=" size-3" />
                        )}
                        {isLoading === 'google' ? 'Authenticating...' : 'Continue with Google'}
                    </Button>

                    <Button
                        onClick={handleGithubAuth}
                        disabled={isLoading === 'github'}
                        variant="bordered"
                    >
                        {isLoading === 'github' ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                            <FaGithub className=" size-3" />
                        )}
                        {isLoading === 'github' ? 'Authenticating...' : 'Continue with GitHub'}
                    </Button>
                </div>
                <div className="text-muted-foreground/50 w-full text-center text-xs">
                    <span className="text-muted-foreground/50">
                        By using this app, you agree to the{' '}
                    </span>
                    <a href="/terms" className="hover:text-foreground underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="hover:text-foreground underline">
                        Privacy Policy
                    </a>
                </div>
                <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>
                    Close
                </Button>
            </div>
        </>
    );
};
