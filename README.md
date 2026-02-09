# PDF Highlight & Find Related Text - Frontend

Web application for viewing PDFs, highlighting text, finding related text, and jumping to locations in the document.

## Features

### Frontend

- **PDF Viewing**: Display PDF with page navigation
- **Highlight**: Select text to create highlights and view highlight list
- **Find Related**: Search for related text in the same PDF
- **Jump + Visual Indication**: Click to jump to location with visual highlight
- **Loading & Empty States**: Display loading and empty states

### Backend Integration

- API endpoint: `POST http://localhost:8000/api/search`
- Request: `multipart/form-data` with `query` (text), `file` (PDF), and `top_k` (number, optional)
- Response: List of results with page_number, text, snippet, confidence, bounding_box

## Tech Stack

- React 19 + TypeScript
- Vite
- react-pdf (PDF rendering)
- Axios (API calls)
- Tailwind CSS (styling)

## Project Structure

```
src/
├── components/
│   ├── PDFViewer.tsx          # Main PDF viewer component
│   ├── HighlightPanel.tsx     # Sidebar displaying highlights list
│   ├── RelatedResultsPanel.tsx # Sidebar displaying search results
│   ├── LoadingSpinner.tsx     # Loading component
│   └── EmptyState.tsx         # Empty state component
├── services/
│   └── api.ts                 # API service for backend calls
├── types/
│   └── index.ts               # TypeScript type definitions
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

## Prerequisites

- Node.js >= 20.16.0
- Backend server running on port 8000

## Installation

```bash
npm install
```

## Run Instructions

### Development

```bash
npm run dev
```

App will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Upload PDF**: Click "Upload PDF" button and select a PDF file
2. **View PDF**: Use Previous/Next buttons to navigate pages
3. **Create Highlight**: Select text on PDF to create a highlight
4. **Find Related**: Click "Find Related" on a highlight to search for related text
5. **Jump to Location**: Click "Jump" or "Jump to location" to navigate to that position

## How It Works

### Related Text Matching

- Frontend sends highlighted text + PDF file to backend
- Backend processes and returns list of results with:
  - `page_number`: Page number
  - `text`: Full matched text from PDF
  - `snippet`: Preview of matched text
  - `confidence`: Match confidence score (0-1)
  - `bounding_box`: Coordinates {x0, y0, x1, y1}

## API Contract

### POST /api/search

**Request:**

```typescript
{
  query: string;      // Text to search for
  file: File;         // PDF file
  top_k?: number;     // Number of results (default: 10)
}
```

**Response:**

```typescript
{
  results: [
    {
      page_number: number;
      text: string;           // Full matched text
      snippet: string;        // Preview
      confidence: number;     // 0-1
      bounding_box: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
      }
    }
  ],
  total_results: number;
  query: string;
}
```

## Error Handling

- Displays error message when backend server is unreachable
- Shows user-friendly error notification in the Related Results panel
- Backend must be running on `http://localhost:8000` for the app to work
