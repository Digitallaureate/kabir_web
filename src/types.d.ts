// Monument-related type definitions
export interface Monument {
    id: string;
    name?: string;
    description?: string;
    image_url?: string;
    period?: string;
    year_built?: string;
    architect?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    is_active?: boolean;
    category?: string;
  }
  
  // Submonument type (parts of a larger monument)
  export interface Submonument {
    id: string;
    parent_id?: string;
    name?: string;
    title?: string;
    image_url?: string;
    description?: string;
    content?: string;
    tags?: string[];
  }
  
  // Route type for connecting monuments
  export interface Route {
[x: string]: boolean;
    id: string;
    name?: string;
    description?: string;
    monument_ids?: string[];
    order?: string[];
    color?: string;
    is_active?: boolean;
    estimated_time?: string;
    distance?: string;
  }
  
  // Component props
  export interface MapViewProps {
    center?: {
      lat: number;
      lng: number;
    };
    zoom?: number;
    height?: string;
  }
  
  export interface MonumentDetailProps {
    monumentId: string;
  }