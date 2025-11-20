export interface HeroImage {
  id: string
  image_url: string
  title?: string
  description?: string
  order_index: number
  created_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  image_url?: string
  order_index: number
  created_at: string
}

export interface Project {
  id: string
  service_id: string
  title: string
  description: string
  image_url: string
  order_index: number
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  position: string
  description?: string
  photo_url?: string
  order_index: number
  created_at: string
}

export interface Testimonial {
  id: string
  author_name: string
  title: string
  description: string
  position?: string
  photo_url?: string
  rating: number
  order_index: number
  created_at: string
}
