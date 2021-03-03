import * as React from 'react';
interface FallbackProps {
    error: Error;
    resetErrorBoundary: (...args: Array<unknown>) => void;
}
interface ErrorBoundaryPropsWithComponent {
    onResetKeysChange?: (prevResetKeys: Array<unknown> | undefined, resetKeys: Array<unknown> | undefined) => void;
    onReset?: (...args: Array<unknown>) => void;
    onError?: (error: Error, info: {
        componentStack: string;
    }) => void;
    resetKeys?: Array<unknown>;
    FallbackComponent: React.ComponentType<FallbackProps>;
}
declare function FallbackRender(props: FallbackProps): React.ReactElement<unknown, string | React.FunctionComponent | typeof React.Component> | null;
interface ErrorBoundaryPropsWithRender {
    onResetKeysChange?: (prevResetKeys: Array<unknown> | undefined, resetKeys: Array<unknown> | undefined) => void;
    onReset?: (...args: Array<unknown>) => void;
    onError?: (error: Error, info: {
        componentStack: string;
    }) => void;
    resetKeys?: Array<unknown>;
    fallbackRender: typeof FallbackRender;
}
interface ErrorBoundaryPropsWithFallback {
    onResetKeysChange?: (prevResetKeys: Array<unknown> | undefined, resetKeys: Array<unknown> | undefined) => void;
    onReset?: (...args: Array<unknown>) => void;
    onError?: (error: Error, info: {
        componentStack: string;
    }) => void;
    resetKeys?: Array<unknown>;
    fallback: React.ReactElement<unknown, string | React.FunctionComponent | typeof React.Component> | null;
}
declare type ErrorBoundaryProps = ErrorBoundaryPropsWithFallback | ErrorBoundaryPropsWithComponent | ErrorBoundaryPropsWithRender;
declare type ErrorBoundaryState = {
    error: Error | null;
};
declare class ErrorBoundary extends React.Component<React.PropsWithRef<React.PropsWithChildren<ErrorBoundaryProps>>, ErrorBoundaryState> {
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    state: ErrorBoundaryState;
    updatedWithError: boolean;
    resetErrorBoundary: (...args: Array<unknown>) => void;
    reset(): void;
    componentDidCatch(error: Error, info: React.ErrorInfo): void;
    componentDidUpdate(prevProps: ErrorBoundaryProps): void;
    render(): {} | null | undefined;
}
declare function withErrorBoundary<P>(Component: React.ComponentType<P>, errorBoundaryProps: ErrorBoundaryProps): React.ComponentType<P>;
declare function useErrorHandler<P = Error>(givenError?: P | null | undefined): React.Dispatch<React.SetStateAction<P | null>>;
export { ErrorBoundary, withErrorBoundary, useErrorHandler };
export type { FallbackProps, ErrorBoundaryPropsWithComponent, ErrorBoundaryPropsWithRender, ErrorBoundaryPropsWithFallback, ErrorBoundaryProps, };
