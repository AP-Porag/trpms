import { PDFViewer } from '@embedpdf/react-pdf-viewer';

export default function PdfViewer({ src }: { src: string }) {
    return (
        <div style={{ height: '100vh' }}>
            <PDFViewer
                config={{
                    src,
                    theme: { preference: 'light' },
                }}
            />
        </div>
    );
}
