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
    res.status(500).json({ message: 'Error fetching media types', error });
  }
};

// Get media type by ID
export const getMediaTypeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const mediaType = await mediaTypeService.getMediaTypeById(id);
    if (mediaType) {
      res.status(200).json(mediaType);
    } else {
      res.status(404).json({ message: 'Media type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media type', error });
  }
};

// Create a new media type
export const createMediaType = async (req: Request, res: Response) => {
  const newMediaType: Omit<MediaType, 'MediaTypeId'> = req.body;
  try {
    const createdMediaType = await mediaTypeService.createMediaType(newMediaType);
    res.status(201).json(createdMediaType);
  } catch (error) {
    res.status(500).json({ message: 'Error creating media type', error });
  }
};

// Update an existing media type
export const updateMediaType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedMediaType: Partial<MediaType> = req.body;
  try {
    const result = await mediaTypeService.updateMediaType(id, updatedMediaType);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Media type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating media type', error });
  }
};

// Delete a media type
export const deleteMediaType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await mediaTypeService.deleteMediaType(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Media type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media type', error });
  }
};
