// src/services/genreService.ts

import pool from '../utils/db';
import { Genre } from '../models/genre';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all genres
export const getAllGenres = async (): Promise<Genre[]> => {
  const [rows] = await pool.query<Genre[] & RowDataPacket[]>('SELECT * FROM Genre');
  return rows;
};

// Get genre by ID
export const getGenreById = async (id: number): Promise<Genre | null> => {
  const [rows] = await pool.query<Genre[] & RowDataPacket[]>('SELECT * FROM Genre WHERE GenreId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new genre
export const createGenre = async (newGenre: Omit<Genre, 'GenreId'>): Promise<Genre> => {
  const { Name } = newGenre;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Genre (Name) VALUES (?)',
    [Name]
  );
  const insertedId = result.insertId;
  return { GenreId: insertedId, Name };
};

// Update an existing genre
export const updateGenre = async (id: number, updatedGenre: Partial<Genre>): Promise<Genre | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Genre SET ? WHERE GenreId = ?',
    [updatedGenre, id]
  );
  if (result.affectedRows > 0) {
    return await getGenreById(id);
  }
  return null;
};

// Delete a genre
export const deleteGenre = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Genre WHERE GenreId = ?', [id]);
  return result.affectedRows > 0;
};
