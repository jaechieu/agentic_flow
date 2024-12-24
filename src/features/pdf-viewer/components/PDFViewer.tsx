"use client";

import { Document, Page } from "react-pdf";
import { usePdfViewer } from "../hooks/usePdfViewer";
import { PDFControls } from "./PDFControls";
import { PDFDropzone } from "./PDFDropzone";
import { ProcessedContent } from "./ProcessedContent";

export function PDFViewer() {
  const {
    file,
    setFile,
    numPages,
    pageNumber,
    scale,
    processedData,
    isProcessing,
    error,
    onDocumentLoadSuccess,
    previousPage,
    nextPage,
    zoomIn,
    zoomOut,
  } = usePdfViewer();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">PDF Viewer</h1>
      {!file ? (
        <PDFDropzone onFileSelect={setFile} />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {isProcessing && (
              <div className="p-4 text-center text-gray-600">
                Processing PDF...
              </div>
            )}
            {error && (
              <div className="p-4 text-center text-red-600">
                {error}
              </div>
            )}
            {processedData && (
              <ProcessedContent data={processedData} pdfName={file.name} />
            )}
            <div className="p-4">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            </div>
            <PDFControls
              pageNumber={pageNumber}
              numPages={numPages}
              onPreviousPage={previousPage}
              onNextPage={nextPage}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
            />
          </div>
        </>
      )}
    </div>
  );
}
