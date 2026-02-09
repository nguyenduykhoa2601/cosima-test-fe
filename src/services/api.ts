import axios from 'axios';
import type { SearchResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const searchRelatedText = async (
  query: string,
  pdfFile: File,
  topK: number = 10
): Promise<SearchResponse> => {
  const formData = new FormData();
  formData.append('query', query);
  formData.append('file', pdfFile);
  formData.append('top_k', topK.toString());

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
};
