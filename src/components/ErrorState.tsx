interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "compact" | "inline";
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  error,
  icon,
  action,
  variant = "default",
}: ErrorStateProps) {
  const isCompact = variant === "compact";
  const isInline = variant === "inline";

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${isCompact ? "py-8" : isInline ? "p-4" : "py-16 md:py-24"}
        ${isInline ? "bg-error/5 border border-error/20 rounded-lg" : ""}
      `}
    >
      {/* Icon */}
      {icon ? (
        <div
          className={`mb-4 text-error ${
            isCompact ? "w-12 h-12" : isInline ? "w-8 h-8" : "w-20 h-20"
          }`}
        >
          {icon}
        </div>
      ) : (
        <svg
          className={`
            text-error
            ${isCompact ? "w-12 h-12" : isInline ? "w-8 h-8" : "w-20 h-20"}
            mb-4
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}

      {/* Text Content */}
      <h3
        className={`
          font-display text-error font-bold
          ${
            isCompact
              ? "text-lg"
              : isInline
              ? "text-base"
              : "text-2xl md:text-3xl"
          }
          mb-2 text-center
        `}
      >
        {title}
      </h3>

      <p
        className={`
          text-text-secondary text-center
          ${
            isCompact
              ? "text-sm"
              : isInline
              ? "text-sm"
              : "text-base md:text-lg"
          }
          max-w-md
          ${isInline ? "mb-3" : "mb-6"}
        `}
      >
        {description}
      </p>

      {/* Error Details */}
      {error && (
        <div
          className={`
          bg-error/10 border-l-4 border-error rounded px-4 py-2 mb-6 max-w-md
          ${isCompact || isInline ? "text-xs" : "text-sm"}
          text-error font-mono
        `}
        >
          {error}
        </div>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            bg-error hover:bg-red-700 text-white font-semibold
            rounded-lg transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error
            ${
              isCompact
                ? "px-4 py-2 text-sm"
                : isInline
                ? "px-3 py-1.5 text-sm"
                : "px-6 py-3"
            }
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function ErrorLoadingState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      title="Failed to load items"
      description="We encountered an error while fetching your items. Please try again."
      action={{
        label: "Retry",
        onClick: onRetry,
      }}
    />
  );
}

export function ErrorNetworkState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      title="Network error"
      description="Please check your internet connection and try again."
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
          />
        </svg>
      }
      action={{
        label: "Retry",
        onClick: onRetry,
      }}
    />
  );
}

export function ErrorNotFoundState() {
  return (
    <ErrorState
      title="Not found"
      description="The item you're looking for doesn't exist or has been removed."
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}

export function ErrorUnauthorizedState({ onLogin }: { onLogin: () => void }) {
  return (
    <ErrorState
      title="Unauthorized"
      description="Please log in to access this content."
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      }
      action={{
        label: "Log In",
        onClick: onLogin,
      }}
    />
  );
}

export function InlineError({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 bg-error/5 border border-error/20 rounded-lg p-4 mb-4">
      <svg
        className="w-5 h-5 text-error flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm text-error flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-error hover:text-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
