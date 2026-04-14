import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { useRef } from 'react';

function ResizableImageComponent({ node, updateAttributes }) {
    const startX = useRef(0);
    const startWidth = useRef(node.attrs.width || 300);

    const onMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();

        startX.current = event.clientX;
        startWidth.current = node.attrs.width || 300;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event) => {
        const diff = event.clientX - startX.current;
        const newWidth = Math.max(100, startWidth.current + diff);

        updateAttributes({
            width: newWidth,
        });
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    return (
        <NodeViewWrapper className="relative inline-block select-none" data-align={node.attrs.align}>
            <img src={node.attrs.src} width={node.attrs.width} className="block rounded-md" draggable={false} />

            {/* RIGHT RESIZE HANDLE */}
            <span
                className="absolute top-1/2 right-0 h-6 w-2 -translate-y-1/2 cursor-ew-resize rounded bg-blue-500 opacity-60"
                onMouseDown={onMouseDown}
            />
        </NodeViewWrapper>
    );
}

export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),

            width: {
                default: 300,
                parseHTML: (element) => parseInt(element.getAttribute('width'), 10) || 300,
                renderHTML: (attributes) => ({
                    width: attributes.width,
                    style: `width: ${attributes.width}px; max-width: 100%;`,
                }),
            },

            align: {
                default: 'center',
                parseHTML: (element) => element.getAttribute('data-align') || 'center',
                renderHTML: (attributes) => ({
                    'data-align': attributes.align,
                }),
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent);
    },
});
