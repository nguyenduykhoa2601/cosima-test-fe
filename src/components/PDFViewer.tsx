import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { Highlight, SearchResult } from "../types";
import HighlightPanel from "./HighlightPanel";
import RelatedResultsPanel from "./RelatedResultsPanel";
import { searchRelatedText } from "../services/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
	file: File | null;
}

const PDFViewer = ({ file }: PDFViewerProps) => {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [highlights, setHighlights] = useState<Highlight[]>([]);
	const [relatedResults, setRelatedResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showRelatedPanel, setShowRelatedPanel] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [highlightOverlay, setHighlightOverlay] = useState<{
		pageNumber: number;
		position: { x: number; y: number; width: number; height: number };
	} | null>(null);
	const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	};

	const handleTextSelection = () => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) return;

		const selectedText = selection.toString().trim();
		if (!selectedText) return;

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		const pageElement = pageRefs.current.get(pageNumber);

		if (pageElement) {
			const pageRect = pageElement.getBoundingClientRect();
			const position = {
				x: rect.left - pageRect.left,
				y: rect.top - pageRect.top,
				width: rect.width,
				height: rect.height,
			};

			const newHighlight: Highlight = {
				id: Date.now().toString(),
				text: selectedText,
				pageNumber,
				position,
			};

			setHighlights((prev) => [...prev, newHighlight]);
			selection.removeAllRanges();
		}
	};

	const handleFindRelated = async (highlight: Highlight) => {
		if (!file) return;

		setIsLoading(true);
		setShowRelatedPanel(true);
		setRelatedResults([]);
		setError(null);

		try {
			const response = await searchRelatedText(highlight.text, file);
			setRelatedResults(response.results);
		} catch (error) {
			console.error("Error finding related text:", error);
			setRelatedResults([]);
			setError(
				"Failed to connect to backend server. Please make sure the server is running on port 8000.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleJumpToHighlight = (highlight: Highlight) => {
		setPageNumber(highlight.pageNumber);
		setHighlightOverlay({
			pageNumber: highlight.pageNumber,
			position: highlight.position,
		});
		setTimeout(() => setHighlightOverlay(null), 2000);
	};

	const handleJumpToMatch = (match: SearchResult) => {
		setPageNumber(match.page_number);
		const bbox = match.bounding_box;
		setHighlightOverlay({
			pageNumber: match.page_number,
			position: {
				x: bbox.x0,
				y: bbox.y0,
				width: bbox.x1 - bbox.x0,
				height: bbox.y1 - bbox.y0,
			},
		});
		setTimeout(() => setHighlightOverlay(null), 2000);
	};

	useEffect(() => {
		document.addEventListener("mouseup", handleTextSelection);
		return () => {
			document.removeEventListener("mouseup", handleTextSelection);
		};
	}, [pageNumber]);

	if (!file) {
		return (
			<div className="flex items-center justify-center h-full bg-gray-50">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-4">
						PDF Highlight & Find Related Text
					</h2>

					<p className="text-gray-600 mb-6">Upload a PDF to get started</p>

					<label className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
						<input
							type="file"
							accept="application/pdf"
							className="hidden"
							onChange={(e) => {
								const uploadedFile = e.target.files?.[0];
								if (uploadedFile) {
									window.location.reload();
								}
							}}
						/>
						Upload PDF
					</label>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen">
			<div className="flex-1 flex flex-col overflow-hidden">
				<div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
					<h1 className="text-xl font-semibold">PDF Viewer</h1>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<button
								onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
								disabled={pageNumber <= 1}
								className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
							>
								Previous
							</button>

							<span className="text-sm">
								Page {pageNumber} of {numPages}
							</span>

							<button
								onClick={() =>
									setPageNumber((prev) => Math.min(numPages, prev + 1))
								}
								disabled={pageNumber >= numPages}
								className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
							>
								Next
							</button>
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-auto bg-gray-100 p-8">
					<div className="max-w-4xl mx-auto bg-white shadow-lg">
						<Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
							<div
								ref={(el) => {
									if (el) pageRefs.current.set(pageNumber, el);
								}}
								className="relative"
							>
								<Page pageNumber={pageNumber} width={800} />

								{highlightOverlay &&
									highlightOverlay.pageNumber === pageNumber && (
										<div
											className="absolute border-4 border-yellow-400 bg-yellow-200 bg-opacity-30 animate-pulse pointer-events-none"
											style={{
												left: `${highlightOverlay.position.x}px`,
												top: `${highlightOverlay.position.y}px`,
												width: `${highlightOverlay.position.width}px`,
												height: `${highlightOverlay.position.height}px`,
											}}
										/>
									)}
							</div>
						</Document>
					</div>
				</div>
			</div>

			<HighlightPanel
				highlights={highlights}
				onFindRelated={handleFindRelated}
				onJumpTo={handleJumpToHighlight}
				isLoading={isLoading}
			/>

			{showRelatedPanel && (
				<RelatedResultsPanel
					results={relatedResults}
					isLoading={isLoading}
					error={error}
					onJumpTo={handleJumpToMatch}
					onClose={() => setShowRelatedPanel(false)}
				/>
			)}
		</div>
	);
};

export default PDFViewer;
