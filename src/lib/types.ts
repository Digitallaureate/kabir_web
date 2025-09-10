export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface Monument {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  description?: string;
}

export interface Submonument {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  monument: string;
  description?: string;
}

export interface Point {
  lat: number;
  lng: number;
}

export interface Tour {
  id: string;
  name: string;
  points: (Point[] | [number, number][]);
  description?: string;
}

export interface ExtendedTour {
  id: string;
  name: string;
  points: (Point[] | [number, number][]);
  description?: string;
}

export interface Route {
  id: string;
  name: string;
  points: (Point[] | [number, number][]);
  description?: string;
}