# PDF Highlight & Find Related Text - Frontend

Web application cho phép người dùng xem PDF, highlight text, tìm kiếm text liên quan và jump tới vị trí đó trong document.

## Features

### Frontend

- **PDF Viewing**: Hiển thị PDF với khả năng navigate qua các pages
- **Highlight**: Chọn text và tạo highlight, hiển thị danh sách highlights
- **Find Related**: Tìm các đoạn text liên quan trong cùng PDF
- **Jump + Visual Indication**: Click để jump tới vị trí và highlight vùng đó
- **Loading & Empty States**: Hiển thị trạng thái loading và empty

### Backend Integration

- API endpoint: `POST http://localhost:8000/api/search`
- Request: `multipart/form-data` với `query` (text), `file` (PDF), và `top_k` (number, optional)
- Response: Danh sách results với page_number, text, snippet, confidence, bounding_box

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
│   ├── HighlightPanel.tsx     # Sidebar hiển thị danh sách highlights
│   ├── RelatedResultsPanel.tsx # Sidebar hiển thị kết quả tìm kiếm
│   ├── LoadingSpinner.tsx     # Loading component
│   └── EmptyState.tsx         # Empty state component
├── services/
│   └── api.ts                 # API service cho backend calls
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

App sẽ chạy tại `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Upload PDF**: Click nút "Upload PDF" và chọn file PDF
2. **View PDF**: Sử dụng nút Previous/Next để navigate
3. **Create Highlight**: Select text trên PDF để tạo highlight
4. **Find Related**: Click "Find Related" trên highlight để tìm text liên quan
5. **Jump to Location**: Click "Jump" hoặc "Jump to location" để nhảy tới vị trí

## How It Works

### Related Text Matching

- Frontend gửi highlighted text + PDF file tới backend
- Backend xử lý và trả về danh sách results với:
  - `page_number`: Page number
  - `text`: Full matched text from PDF
  - `snippet`: Preview of matched text
  - `confidence`: Match confidence score (0-1)
  - `bounding_box`: Coordinates {x0, y0, x1, y1}

### Visual Indication

- Khi jump tới location, hiển thị yellow border animated
- Border tự động mất sau 2 giây
- Sử dụng absolute positioning với coordinates từ backend

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

## Notes

- Backend phải chạy trên `http://localhost:8000`
- Support multiple highlights
- Có thể extend thêm confidence score cho ranking
- PDF worker được load từ CDN (unpkg.com)
