export type Business = {
  placeId: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
};

export type BusinessDetails = {
  phone?: string;
  website?: string;
  rating?: number | null;
};