import { PDFViewer } from '@/features/pdf-viewer/components/PDFViewer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PDF Analyzer</h1>
          <p className="text-gray-600">Upload your PDF to view and analyze its contents</p>
        </header>
        <PDFViewer />
      </div>
    </main>
  )
}


