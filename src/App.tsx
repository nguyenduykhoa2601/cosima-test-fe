import { useState } from "react";
import PDFViewer from "./components/PDFViewer";

function App() {
	const [pdfFile, setPdfFile] = useState<File | null>(null);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type === "application/pdf") {
			setPdfFile(file);
		}
	};

	return (
		<div className="h-screen w-screen overflow-hidden">
			{!pdfFile ? (
				<div className="flex items-center justify-center h-full bg-gray-50">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-4">
							PDF Highlight & Find Related Text
						</h1>

						<p className="text-gray-600 mb-8">
							Upload a PDF document to get started
						</p>

						<label className="px-8 py-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block text-lg">
							Upload PDF
							<input
								type="file"
								accept="application/pdf"
								className="hidden"
								onChange={handleFileUpload}
							/>
						</label>
					</div>
				</div>
			) : (
				<PDFViewer file={pdfFile} />
			)}
		</div>
	);
}

export default App;
