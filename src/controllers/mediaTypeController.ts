// src/controllers/mediaTypeController.ts

import { Request, Response } from 'express';
import * as mediaTypeService from '../services/mediaTypeService';
import { MediaType } from '../models/mediaType';

// Get all media types with pagination
export const getAllMediaTypes = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
  const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

  try {
    const { mediaTypes, totalCount } = await mediaTypeService.getAllMediaTypes(limit, offset);
    res.status(200).json({
      mediaTypes,  // Paginated media types data
      totalCount,  // Total number of media types for pagination
    });
  } catch (error) {
    console.error('Error fetching media types:', error);
    res.status(500).json({ message: 'Error fetching media types' });
  }
};

// Get media type by ID
export const getMediaTypeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid MediaTypeId. It must be a positive number.' });
  }

  try {
    const mediaType = await mediaTypeService.getMediaTypeById(id);
    if (mediaType) {
      res.status(200).json(mediaType);
    } else {
      res.status(404).json({ message: 'Media type not found' });
    }
  } catch (error) {
    console.error('Error fetching media type:', error);
    res.status(500).json({ message: 'Error fetching media type' });
  }
};

// Create a new media type with validation
export const createMediaType = async (req: Request, res: Response) => {
  const { Name } = req.body;

  if (!Name || Name.length < 2) {
    return res.status(400).json({ errors: { Name: 'Media type name is required and must be at least 2 characters long.' } });
  }

  try {
    const createdMediaType = await mediaTypeService.createMediaType({ Name });
    res.status(201).json(createdMediaType);
  } catch (error) {
    console.error('Error creating media type:', error);
    res.status(500).json({ message: 'Error creating media type' });
  }
};

// Update an existing media type with validation
export const updateMediaType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { Name } = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid MediaTypeId. It must be a positive number.' });
  }

  if (!Name || Name.length < 2) {
    return res.status(400).json({ errors: { Name: 'Media type name is required and must be at least 2 characters long.' } });
  }

  try {
    const result = await mediaTypeService.updateMediaType(id, { Name });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Media type not found' });
    }
  } catch (error) {
    console.error('Error updating media type:', error);
    res.status(500).json({ message: 'Error updating media type' });
  }
};

// Delete a media type
export const deleteMediaType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid MediaTypeId. It must be a positive number.' });
  }

  try {
    const result = await mediaTypeService.deleteMediaType(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Media type not found' });
    }
  } catch (error) {
    console.error('Error deleting media type:', error);
    res.status(500).json({ message: 'Error deleting media type' });
  }
};
