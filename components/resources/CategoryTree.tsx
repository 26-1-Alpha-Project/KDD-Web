"use client";

import { ChevronRight, Folder, FolderOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/types/api/document";

interface CategoryTreeNodeProps {
  node: CategoryNode;
  expandedNodes: Set<string>;
  selectedCategoryId: string | null;
  onToggleNode: (id: string) => void;
  onSelectCategory: (id: string) => void;
  depth?: number;
}

function CategoryTreeNode({
  node,
  expandedNodes,
  selectedCategoryId,
  onToggleNode,
  onSelectCategory,
  depth = 0,
}: CategoryTreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.categoryId);
  const isSelected = selectedCategoryId === node.categoryId;

  const handleClick = () => {
    if (hasChildren) {
      onToggleNode(node.categoryId);
    }
    onSelectCategory(node.categoryId);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center justify-between gap-2 py-2 text-sm transition-colors",
          depth > 0 && "pl-8",
          isSelected
            ? "text-primary font-medium"
            : "text-foreground hover:text-primary"
        )}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <ChevronRight
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            />
          ) : (
            <span className="size-4 shrink-0" />
          )}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="size-4 shrink-0 text-primary" />
            ) : (
              <Folder className="size-4 shrink-0 text-muted-foreground" />
            )
          ) : (
            <FileText className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span>{node.name}</span>
        </div>
        {node.documentCount !== undefined && (
          <span className="text-xs text-muted-foreground">
            {node.documentCount}
          </span>
        )}
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.categoryId}
              node={child}
              expandedNodes={expandedNodes}
              selectedCategoryId={selectedCategoryId}
              onToggleNode={onToggleNode}
              onSelectCategory={onSelectCategory}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  tree: CategoryNode[];
  expandedNodes: Set<string>;
  selectedCategoryId: string | null;
  onToggleNode: (id: string) => void;
  onSelectCategory: (id: string) => void;
}

export function CategoryTree({
  tree,
  expandedNodes,
  selectedCategoryId,
  onToggleNode,
  onSelectCategory,
}: CategoryTreeProps) {
  return (
    <div className="flex flex-col">
      {tree.map((node) => (
        <CategoryTreeNode
          key={node.categoryId}
          node={node}
          expandedNodes={expandedNodes}
          selectedCategoryId={selectedCategoryId}
          onToggleNode={onToggleNode}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
}
