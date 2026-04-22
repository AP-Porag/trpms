import { PDFViewer } from '@embedpdf/react-pdf-viewer';
import { useEffect, useState } from 'react';

type Props = {
    src: string;
    title?: string;
};

export default function PdfViewer({ src, title }: Props) {
    const [loading, setLoading] = useState(true);

    const fullSrc = `${window.location.origin}${src}`;

    useEffect(() => {
        setLoading(true);
    }, [src]);

    return (
        <div className="flex h-full w-full flex-col rounded-xl border bg-white shadow-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-4 py-2">
                <h2 className="text-sm font-semibold text-gray-700">{title ?? 'PDF Document'}</h2>
            </div>

            {/* LOADING */}
            {loading && <div className="flex flex-1 items-center justify-center text-sm text-gray-500">Loading PDF...</div>}

            {/* VIEWER */}
            <div className="flex-1">
                <PDFViewer
                    config={{
                        src: fullSrc,
                        theme: { preference: 'light' },
                    }}
                    onLoad={() => setLoading(false)}
                />
            </div>
        </div>
    );
}
