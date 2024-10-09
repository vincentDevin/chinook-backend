import pool from '../utils/db';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Genre } from '../models/genre';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define a new type that includes an artist and their related albums
export type ArtistWithAlbums = Artist & {
  albums: Album[];
};

// Define the ArtistWithDetails type
export type ArtistWithDetails = {
  ArtistId: number;
  Name: string;
  // You can add more fields if needed, depending on your schema
};


// Fetch artist by ID, including albums
export const getArtistByIdWithAlbums = async (id: number): Promise<ArtistWithAlbums | null> => {
  try {
    // Fetch the artist by ID
    const [artistRows] = await pool.query<Artist[] & RowDataPacket[]>(
      'SELECT * FROM Artist WHERE ArtistId = ?',
      [id]
    );

    if (artistRows.length === 0) {
      return null; // Artist not found
    }

    const artist = artistRows[0];

    // Fetch the albums related to the artist
    const [albumRows] = await pool.query<Album[] & RowDataPacket[]>(
      'SELECT * FROM Album WHERE ArtistId = ?',
      [id]
    );

    // Return the artist with their albums
    return {
      ...artist,
      albums: albumRows,
    };
  } catch (error) {
    console.error('Error fetching artist with albums:', error);
    throw new Error('Database query failed');
  }
};

export const getAllArtists = async (limit: number, offset: number): Promise<{ artists: Artist[], totalCount: number }> => {
  try {
    const [artists] = await pool.query<Artist[] & RowDataPacket[]>(
      'SELECT * FROM Artist LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalCount FROM Artist'
    );

    const totalCount = totalCountResult[0].totalCount;
    return { artists, totalCount };
  } catch (error) {
    console.error('Error fetching all artists:', error);
    throw new Error('Failed to fetch artists');
  }
};

// Get artist by ID, including all distinct genres from their albums
export const getArtistById = async (id: number): Promise<Artist | null> => {
  try {
    // Modify the query to join Genre through the Track table
    const [rows] = await pool.query<Artist[] & RowDataPacket[]>(
      `SELECT 
        ar.ArtistId,
        ar.Name,
        GROUP_CONCAT(DISTINCT g.Name) AS Genres -- Concatenate distinct genre names
      FROM Artist ar
      LEFT JOIN Album a ON ar.ArtistId = a.ArtistId
      LEFT JOIN Track t ON a.AlbumId = t.AlbumId -- Join Track through Album
      LEFT JOIN Genre g ON t.GenreId = g.GenreId -- Join Genre through Track
      WHERE ar.ArtistId = ?
      GROUP BY ar.ArtistId, ar.Name`, // Group by Artist to get unique genres
      [id]
    );

    if (rows.length > 0) {
      return {
        ArtistId: rows[0].ArtistId,
        Name: rows[0].Name,
        Genres: rows[0].Genres ? (rows[0].Genres as unknown as string).split(',') : [] // Convert Genres to string first
      };
    } else {
      return null; // No artist found with the provided ID
    }
  } catch (error) {
    console.error('Error fetching artist with genres:', error); // Log the error for debugging purposes
    throw new Error('Database query failed'); // Throw a generic error message
  }
};

// Create a new artist
export const createArtist = async (newArtist: Omit<Artist, 'ArtistId'>): Promise<Artist> => {
  const { Name } = newArtist;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Artist (Name) VALUES (?)',
    [Name]
  );
  const insertedId = result.insertId;
  return { ArtistId: insertedId, Name };
};

export const updateArtist = async (id: number, updatedArtist: Partial<ArtistWithDetails>): Promise<ArtistWithDetails | null> => {
  const currentArtist = await getArtistById(id);

  if (!currentArtist) {
    throw new Error('Artist not found');
  }

  const mergedArtist = {
    Name: updatedArtist.Name ?? currentArtist.Name,
  };

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Artist SET Name = ? WHERE ArtistId = ?`,
    [mergedArtist.Name, id]
  );

  if (result.affectedRows > 0) {
    // Instead of fetching again, return the merged data
    return {
      ArtistId: id,
      Name: mergedArtist.Name,
    };
  }

  return null;
};

// Delete an artist and update related albums and tracks to reference "Unknown Artist"
export const deleteArtist = async (id: number): Promise<boolean> => {
  const connection = await pool.getConnection(); // Start a transaction
  try {
    // Start the transaction
    await connection.beginTransaction();

    // Ensure there is an artist named "Unknown Artist" and get its ArtistId
    const [unknownArtistResult] = await connection.query<RowDataPacket[]>(
      'SELECT ArtistId FROM Artist WHERE Name = "Unknown Artist" LIMIT 1'
    );
    
    let unknownArtistId;

    // If "Unknown Artist" doesn't exist, create it and get the new ArtistId
    if (unknownArtistResult.length === 0) {
      const [insertResult] = await connection.query<ResultSetHeader>(
        'INSERT INTO Artist (Name) VALUES ("Unknown Artist")'
      );
      unknownArtistId = insertResult.insertId;
    } else {
      unknownArtistId = unknownArtistResult[0].ArtistId;
    }

    // Set ArtistId to "Unknown Artist" for all albums related to the artist being deleted
    await connection.query<ResultSetHeader>(
      'UPDATE Album SET ArtistId = ? WHERE ArtistId = ?',
      [unknownArtistId, id]
    );

    // Set ArtistId to "Unknown Artist" for all tracks related to the artist being deleted
    await connection.query<ResultSetHeader>(
      `UPDATE Track t
       JOIN Album a ON t.AlbumId = a.AlbumId
       SET a.ArtistId = ?, t.AlbumId = NULL
       WHERE a.ArtistId = ?`,
      [unknownArtistId, id]
    );

    // Now delete the artist after the related albums and tracks are updated
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM Artist WHERE ArtistId = ?',
      [id]
    );

    // Commit the transaction
    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error('Error deleting artist:', error);
    throw error;
  } finally {
    connection.release(); // Release the connection
  }
};
