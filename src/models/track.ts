// src/models/track.ts

export interface Track {
    TrackId: number;
    Name: string;
    AlbumId?: number | null;  // AlbumId is optional and can be null
    MediaTypeId: number;
    GenreId?: number | null;  // GenreId is optional and can be null
    Composer?: string | null; // Composer is optional and can be null
    Milliseconds: number;
    Bytes?: number | null;    // Bytes is optional and can be null
    UnitPrice: number;
  }
  