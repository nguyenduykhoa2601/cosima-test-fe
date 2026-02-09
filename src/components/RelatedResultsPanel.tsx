import type { SearchResult } from "../types";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

interface RelatedResultsPanelProps {
	results: SearchResult[];
	isLoading: boolean;
	error: string | null;
	onJumpTo: (match: SearchResult) => void;
	onClose: () => void;
}

const RelatedResultsPanel = ({
	results,
	isLoading,
	error,
	onJumpTo,
	onClose,
}: RelatedResultsPanelProps) => {
	return (
		<div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
			<div className="p-4 border-b border-gray-200 flex justify-between items-center">
				<h2 className="text-lg font-semibold">Related Results</h2>

				<button
					onClick={onClose}
					className="text-gray-500 hover:text-gray-700 text-xl"
				>
					×
				</button>
			</div>

			<div className="p-4">
				{isLoading ? (
					<LoadingSpinner />
				) : error ? (
					<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				) : results.length === 0 ? (
					<EmptyState message="No related text found" />
				) : (
					<div className="space-y-3">
						{results.map((match, index) => (
							<div
								key={index}
								className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
							>
								<p className="text-sm mb-2 line-clamp-3">{match.snippet}</p>

								<div className="flex items-center justify-between mb-2">
									<p className="text-xs text-gray-500">
										Page {match.page_number}
									</p>

									<p className="text-xs text-blue-600">
										{Math.round(match.confidence * 100)}% match
									</p>
								</div>

								<button
									onClick={() => onJumpTo(match)}
									className="w-full px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
								>
									Jump to location
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default RelatedResultsPanel;
