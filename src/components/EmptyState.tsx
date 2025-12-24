interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "compact";
}

export function EmptyState({
  title = "No items found",
  description = "Try adjusting your search or filters",
  icon,
  action,
  variant = "default",
}: EmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${isCompact ? "py-8" : "py-16 md:py-24"}
      `}
    >
      {/* Icon */}
      {icon ? (
        <div
          className={`mb-4 ${isCompact ? "text-4xl" : "text-6xl"} opacity-50`}
        >
          {icon}
        </div>
      ) : (
        <svg
          className={`mb-4 text-text-secondary ${
            isCompact ? "w-12 h-12" : "w-20 h-20"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}

      {/* Text Content */}
      <h3
        className={`
          font-display text-text-primary font-bold
          ${isCompact ? "text-lg" : "text-2xl md:text-3xl"}
          mb-2 text-center
        `}
      >
        {title}
      </h3>

      <p
        className={`
          text-text-secondary text-center
          ${isCompact ? "text-sm max-w-xs" : "text-base md:text-lg max-w-md"}
          mb-6
        `}
      >
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            bg-primary hover:bg-primary-dark text-white font-semibold
            rounded-lg transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
            ${isCompact ? "px-4 py-2 text-sm" : "px-6 py-3"}
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function EmptySearchState() {
  return (
    <EmptyState
      title="No products found"
      description="We couldn't find any products matching your search. Try different keywords or browse all products."
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
    />
  );
}

export function EmptyCartState() {
  return (
    <EmptyState
      title="Your cart is empty"
      description="Start shopping to add items to your cart"
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      }
    />
  );
}

export function EmptyOrderState() {
  return (
    <EmptyState
      title="No orders yet"
      description="Start browsing our collection to place your first order"
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}
