export interface Document {
  documentId: string;
  title: string;
  category: string;
  categoryPath?: string;
  department?: string;
  updatedAt: string;
  fileSize?: string;
  viewCount?: number;
  excerpt?: string;
  refCount?: number;
}

export interface DocumentDetail extends Document {
  content?: string;
  fileUrl?: string;
  pages?: number;
}

export interface CategoryNode {
  categoryId: string;
  name: string;
  documentCount?: number;
  children?: CategoryNode[];
}

export interface PopularDocument {
  documentId: string;
  title: string;
  category: string;
  viewCount?: number;
  referenceCount?: number;
  popularityScore?: number;
  updatedAt: string;
}
