import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface PDFControlsProps {
  pageNumber: number;
  numPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function PDFControls({
  pageNumber,
  numPages,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
}: PDFControlsProps) {
  return (
    <div className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="flex space-x-2">
        <button
          onClick={onZoomOut}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-50"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={onZoomIn}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-50"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onPreviousPage}
          disabled={pageNumber <= 1}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm">
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={pageNumber >= numPages}
          className="bg-white p-2 rounded-full shadow hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
