// Shared types for Botani Mart
export type Product = {
  slug: string
  name: string
  category: string
  price: number
  unit: string
  emoji: string
  short: string
  description: string
  benefits: string[]
  usage: string
}

export type CategoryInfo = {
  name: string
  icon: string
  blurb: string
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatResponse = {
  reply: string
  products: string[] // recommended product slugs
  placeholder?: boolean
}

export type View = 'home' | 'catalog' | 'detail' | 'about' | 'chat'
