export interface Highlight {
  id: string;
  text: string;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface BoundingBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface SearchResult {
  page_number: number;
  text: string;
  snippet: string;
  confidence: number;
  bounding_box: BoundingBox;
}

export interface SearchResponse {
  results: SearchResult[];
  total_results: number;
  query: string;
}
