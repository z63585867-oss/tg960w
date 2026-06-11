export interface SubCategory {
  name: string;
  slug: string;
  skillCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  skillCount: number;
  subcategories: SubCategory[];
}
