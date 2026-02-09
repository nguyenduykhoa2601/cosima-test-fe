import type { Highlight } from "../types";

interface HighlightPanelProps {
	highlights: Highlight[];
	onFindRelated: (highlight: Highlight) => void;
	onJumpTo: (highlight: Highlight) => void;
	isLoading: boolean;
}

const HighlightPanel = ({
	highlights,
	onFindRelated,
	onJumpTo,
	isLoading,
}: HighlightPanelProps) => {
	return (
		<div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
			<div className="p-4 border-b border-gray-200">
				<h2 className="text-lg font-semibold">Highlights</h2>
			</div>
			<div className="p-4 space-y-3">
				{highlights.length === 0 ? (
					<p className="text-gray-500 text-sm">
						No highlights yet. Select text in the PDF to create one.
					</p>
				) : (
					highlights.map((highlight) => (
						<div
							key={highlight.id}
							className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
						>
							<p className="text-sm mb-2 line-clamp-3">{highlight.text}</p>

							<p className="text-xs text-gray-500 mb-2">
								Page {highlight.pageNumber}
							</p>

							<div className="flex gap-2">
								<button
									onClick={() => onJumpTo(highlight)}
									className="flex-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
								>
									Jump
								</button>

								<button
									onClick={() => onFindRelated(highlight)}
									disabled={isLoading}
									className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded transition-colors"
								>
									{isLoading ? "Loading..." : "Find Related"}
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default HighlightPanel;
