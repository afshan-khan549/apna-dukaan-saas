export interface Store {
  id: string
  owner_id: string
  name: string
  slug: string
  category: string | null
  description: string | null
  phone: string | null
  address: string | null
  created_at: string
}

export interface Product {
  id: string
  store_id: string
  name: string
  description: string | null
  price: number | null
  in_stock: boolean
  created_at: string
}

export type StoreInput = Pick<Store, 'name' | 'slug' | 'category' | 'description' | 'phone' | 'address'>

export type ProductInput = Pick<Product, 'name' | 'description' | 'price' | 'in_stock'>
