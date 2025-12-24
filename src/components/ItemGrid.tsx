"use client";

import { ClothingItem } from "@/types";
import ItemCard from "./ItemCard";
import { SkeletonCardGrid } from "./SkeletonLoader";
import { EmptySearchState } from "./EmptyState";

interface ItemGridProps {
  items: ClothingItem[];
  loading?: boolean;
  onItemClick?: (item: ClothingItem) => void;
}

export default function ItemGrid({
  items,
  loading = false,
  onItemClick,
}: ItemGridProps) {
  return (
    <div className="articles-grid">
      {loading ? (
        <SkeletonCardGrid count={8} />
      ) : items.length > 0 ? (
        items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onImageClick={() => onItemClick?.(item)}
          />
        ))
      ) : (
        <EmptySearchState />
      )}
    </div>
  );
}
