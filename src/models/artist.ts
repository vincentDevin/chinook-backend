import { Album } from './album';

export interface Artist {
  ArtistId: number;   // Primary key, auto-incremented
  Name: string;       // Name of the artist, can be null
  albums?: Album[];   // Optional albums field to represent the relationship
  Genres?: string[];  // Optional Genres field to represent multiple genres
}
