export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_urls: string[];
  price: number | null;
  show_price: boolean;
  stock: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
};