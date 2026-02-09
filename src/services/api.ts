import axios from 'axios';
import type { SearchResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const searchRelatedText = async (
  query: string,
  pdfFile: File,
  topK: number = 10
): Promise<SearchResponse> => {
  // Validate query length on frontend
  if (query.length > 1000) {
    throw new Error(`Query is too long (${query.length} characters). Maximum allowed is 1000 characters.`);
  }

  const formData = new FormData();
  formData.append('query', query);
  formData.append('file', pdfFile);
  formData.append('top_k', topK.toString());

  try {
    const response = await axios.post<SearchResponse>(
      `${API_BASE_URL}/api/search`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          // Pydantic validation error format
          const errorMsg = detail.map((err: any) => {
            if (err.type === 'string_too_long') {
              return `Query is too long. Maximum allowed is ${err.ctx?.max_length || 1000} characters.`;
            }
            return err.msg || 'Validation error';
          }).join(', ');
          throw new Error(errorMsg);
        } else if (typeof detail === 'string') {
          // Extract meaningful error from detail string
          if (detail.includes('string_too_long')) {
            throw new Error('Query is too long. Maximum allowed is 1000 characters.');
          }
          throw new Error(detail);
        }
      }
      // Other API errors
      throw new Error(error.response?.data?.message || error.message || 'Failed to search');
    }
    throw error;
  }
};
