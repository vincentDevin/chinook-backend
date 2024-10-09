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
    console.log(`Updating media type with id: ${id}, new data:`, updatedMediaType);
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE MediaType SET Name = ? WHERE MediaTypeId = ?',
      [updatedMediaType.Name, id]
    );

    if (result.affectedRows > 0) {
      console.log(`Media type with id: ${id} updated successfully.`);
      return getMediaTypeById(id);
    }
    
    console.log(`Media type with id: ${id} not found for update.`);
    return null;
  } catch (error) {
    console.error('Error updating media type:', error);
    throw error;
  }
};


// Delete a media type and update related tracks to have 'Unknown Media Type'
export const deleteMediaType = async (id: number): Promise<boolean> => {
  const connection = await pool.getConnection(); // Start a transaction
  try {
    // Start the transaction
    await connection.beginTransaction();

    // Fetch the ID of the 'Unknown Media Type' entry
    const [unknownMediaTypeResult] = await connection.query<RowDataPacket[]>(
      'SELECT MediaTypeId FROM MediaType WHERE Name = ? LIMIT 1',
      ['Unknown Media Type']
    );

    let unknownMediaTypeId: number;

    if (unknownMediaTypeResult.length > 0) {
      unknownMediaTypeId = unknownMediaTypeResult[0].MediaTypeId;
    } else {
      // Insert 'Unknown Media Type' if it doesn't exist and get the ID
      const [insertResult] = await connection.query<ResultSetHeader>(
        'INSERT INTO MediaType (Name) VALUES (?)',
        ['Unknown Media Type']
      );
      unknownMediaTypeId = insertResult.insertId;
    }

    // Update all tracks that are using the media type to be deleted to 'Unknown Media Type'
    await connection.query<ResultSetHeader>(
      'UPDATE Track SET MediaTypeId = ? WHERE MediaTypeId = ?',
      [unknownMediaTypeId, id]
    );

    // Now delete the media type after the related tracks are updated
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM MediaType WHERE MediaTypeId = ?',
      [id]
    );

    // Commit the transaction
    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error('Error deleting media type:', error);
    throw error;
  } finally {
    connection.release(); // Release the connection
  }
};

