import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { forwardRef, useImperativeHandle } from 'react';

import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';

import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from './extensions/ResizableImage';
import RichTextToolbar from './RichTextToolbar';
import TableToolbar from './TableToolbar';

/**
 * ✅ EXTENDED TABLE WITH ALIGN SUPPORT
 * This allows: editor.updateAttributes("table", { align: "center" })
 */
const AlignedTable = Table.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            align: {
                default: 'left',
                parseHTML: element =>
                    element.getAttribute('data-align'),
                renderHTML: attributes => ({
                    'data-align': attributes.align,
                }),
            },
        };
    },
});

const RichTextEditor = forwardRef(({ value, onChange }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit,

            // ✅ Image with resize + align
            ResizableImage,

            // ✅ Table with resize + align
            AlignedTable.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,

            // ✅ Text alignment (paragraphs + headings)
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],

        content: value || '',

        editorProps: {
            attributes: {
                class:
                    'ProseMirror prose prose-sm max-w-none min-h-[260px] px-3 py-2 focus:outline-none',
            },
        },

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // 🔑 expose editor instance to parent (needed for temp images finalize)
    useImperativeHandle(ref, () => ({
        editor,
    }));

    if (!editor) return null;

    return (
        <div className="rounded-md border bg-white dark:bg-gray-900">
            {/* ✅ ALWAYS visible main toolbar (text + image + align) */}
            <RichTextToolbar editor={editor} />

            {/* ✅ Contextual table controls (row / column actions) */}
            <TableToolbar editor={editor} />

            <EditorContent editor={editor} />
        </div>
    );
});

export default RichTextEditor;
