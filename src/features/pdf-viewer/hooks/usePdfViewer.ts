import { useState } from 'react'
import { pdfjs } from 'react-pdf'
import { processPDF } from '../services/pdfService'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFProcessingResponse {
  message: string;
  data: {
    meeting_room_cost_per_person: number;
    sleeping_room_cost_per_night: number;
    breakout_room_cost_per_person: number;
    meeting_room_quote: number;
    sleeping_room_quote: number;
    total_quote: number;
  };
}

export function usePdfViewer() {
  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [processedData, setProcessedData] = useState<PDFProcessingResponse['data'] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (newFile: File) => {
    setFile(newFile)
    setIsProcessing(true)
    setError(null)
    
    try {
      const response = await processPDF(newFile)
      if ('data' in response) {
        setProcessedData(response.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError('Failed to process PDF. Please try again.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(prevPageNumber + offset, 1), numPages))
  }

  const previousPage = () => changePage(-1)
  const nextPage = () => changePage(1)

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 2))
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.5))

  return {
    file,
    setFile: handleFileSelect,
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
  }
}

