"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = exports.withErrorBoundary = exports.ErrorBoundary = void 0;
// copied from https://github.com/bvaughn/react-error-boundary/blob/master/src/index.tsx
const React = require("react");
const changedArray = (a = [], b = []) => a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
const initialState = { error: null };
class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = initialState;
        this.updatedWithError = false;
        this.resetErrorBoundary = (...args) => {
            var _a, _b;
            (_b = (_a = this.props).onReset) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
            this.reset();
        };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    reset() {
        this.updatedWithError = false;
        this.setState(initialState);
    }
    componentDidCatch(error, info) {
        var _a, _b;
        (_b = (_a = this.props).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, info);
    }
    componentDidUpdate(prevProps) {
        var _a, _b;
        const { error } = this.state;
        const { resetKeys } = this.props;
        // There's an edge case where if the thing that triggered the error
        // happens to *also* be in the resetKeys array, we'd end up resetting
        // the error boundary immediately. This would likely trigger a second
        // error to be thrown.
        // So we make sure that we don't check the resetKeys on the first call
        // of cDU after the error is set
        if (error !== null && !this.updatedWithError) {
            this.updatedWithError = true;
            return;
        }
        if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
            (_b = (_a = this.props).onResetKeysChange) === null || _b === void 0 ? void 0 : _b.call(_a, prevProps.resetKeys, resetKeys);
            this.reset();
        }
    }
    render() {
        const { error } = this.state;
        // @ts-expect-error ts(2339) (at least one of these will be defined though, and we check for their existance)
        const { fallbackRender, FallbackComponent, fallback } = this.props;
        if (error !== null) {
            const props = {
                error,
                resetErrorBoundary: this.resetErrorBoundary,
            };
            if (React.isValidElement(fallback)) {
                return fallback;
            }
            else if (typeof fallbackRender === 'function') {
                return fallbackRender(props);
            }
            else if (FallbackComponent) {
                return React.createElement(FallbackComponent, Object.assign({}, props));
            }
            else {
                throw new Error('react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop');
            }
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
function withErrorBoundary(Component, errorBoundaryProps) {
    const Wrapped = props => {
        return (React.createElement(ErrorBoundary, Object.assign({}, errorBoundaryProps),
            React.createElement(Component, Object.assign({}, props))));
    };
    // Format for display in DevTools
    const name = Component.displayName || Component.name || 'Unknown';
    Wrapped.displayName = `withErrorBoundary(${name})`;
    return Wrapped;
}
exports.withErrorBoundary = withErrorBoundary;
function useErrorHandler(givenError) {
    const [error, setError] = React.useState(null);
    if (givenError)
        throw givenError;
    if (error)
        throw error;
    return setError;
}
exports.useErrorHandler = useErrorHandler;
/*
eslint
  @typescript-eslint/no-throw-literal: "off",
  @typescript-eslint/prefer-nullish-coalescing: "off"
*/ 
//# sourceMappingURL=ErrorBoundary.js.map