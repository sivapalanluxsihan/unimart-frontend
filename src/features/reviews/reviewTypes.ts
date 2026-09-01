export interface Review {
  id: number;
  orderId: number;
  reviewerName: string;
  revieweeId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewInput {
  orderId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  id: number;
  rating: number;
  comment?: string;
}
