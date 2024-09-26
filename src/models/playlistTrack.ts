// src/models/playlistTrack.ts

export interface PlaylistTrack {
    PlaylistId: number;  // Foreign key to Playlist
    TrackId: number;     // Foreign key to Track
  }
  