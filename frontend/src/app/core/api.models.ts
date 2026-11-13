export interface ApiCategory {
  id: number;
  name: string;
  description: string | null;
  status: boolean;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  category: ApiCategory;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  image: string | null;
  status: boolean;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  is_admin: boolean;
  is_active: boolean;
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  product?: ApiProduct;
}

export interface ApiCartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  product?: Pick<ApiProduct, 'id' | 'name' | 'image'>;
}

export interface ApiCart {
  id: number;
  user_id: number;
  items: ApiCartItem[];
  quantity: number;
  total: string | number;
}

export interface ApiOrder {
  id: number;
  user_id: number;
  user?: ApiUser;
  items_count?: number;
  items?: ApiOrderItem[];
  status: 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
  total: string | number;
  created_at: string;
  shipping_name: string | null;
  shipping_email: string | null;
  shipping_phone: string | null;
  shipping_cep: string | null;
  shipping_street: string | null;
  shipping_number: string | null;
  shipping_complement: string | null;
  shipping_neighborhood: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  payment_method: 'cartao' | 'pix' | null;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}
