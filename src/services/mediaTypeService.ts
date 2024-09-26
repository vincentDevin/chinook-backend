// src/services/mediaTypeService.ts

import pool from '../utils/db';
import { MediaType } from '../models/mediaType';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all media types with pagination
export const getAllMediaTypes = async (limit: number, offset: number): Promise<{ mediaTypes: MediaType[], totalCount: number }> => {
  try {
    // Get paginated media types
    const [mediaTypes] = await pool.query<MediaType[] & RowDataPacket[]>(
      'SELECT * FROM MediaType LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Get the total count of media types
    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalCount FROM MediaType'
    );
    const totalCount = totalCountResult[0].totalCount;

    return { mediaTypes, totalCount };
  } catch (error) {
    console.error('Error fetching media types:', error);
    throw error;
  }
};

// Get media type by ID
export const getMediaTypeById = async (id: number): Promise<MediaType | null> => {
  try {
    const [rows] = await pool.query<MediaType[] & RowDataPacket[]>(
      'SELECT * FROM MediaType WHERE MediaTypeId = ?',
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching media type by ID:', error);
    throw error;
  }
};

// Create a new media type
export const createMediaType = async (newMediaType: Omit<MediaType, 'MediaTypeId'>): Promise<MediaType> => {
  try {
    const { Name } = newMediaType;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO MediaType (Name) VALUES (?)',
      [Name]
    );
    const insertedId = result.insertId;

    return { MediaTypeId: insertedId, ...newMediaType };
  } catch (error) {
    console.error('Error creating media type:', error);
    throw error;
  }
};

// Update an existing media type
export const updateMediaType = async (id: number, updatedMediaType: Partial<MediaType>): Promise<MediaType | null> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE MediaType SET Name = ? WHERE MediaTypeId = ?',
      [updatedMediaType.Name, id]
    );

    if (result.affectedRows > 0) {
      return getMediaTypeById(id);
    }
    return null;
  } catch (error) {
    console.error('Error updating media type:', error);
    throw error;
  }
};

// Delete a media type
export const deleteMediaType = async (id: number): Promise<boolean> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM MediaType WHERE MediaTypeId = ?',
      [id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting media type:', error);
    throw error;
  }
};
