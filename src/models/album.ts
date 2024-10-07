import { Track } from './track';  // Import the Track interface

export interface Album {
  AlbumId: number;    // Primary key, auto-incremented
  Title: string;      // Album title
  ArtistId: number;   // Foreign key to associate with the artist
  tracks?: Track[];   // Optional array of tracks in the album
}

export type NewAlbum = Omit<Album, 'AlbumId'>;  // A type that omits 'AlbumId'
