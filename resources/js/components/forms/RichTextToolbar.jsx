import { Separator } from '@/components/ui/separator';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from 'lucide-react';

import EditorButton from './EditorButton';

export default function RichTextToolbar({ editor }) {
    if (!editor) return null;

    const prevent = (e, cb) => {
        e.preventDefault();
        e.stopPropagation();
        cb?.();
    };



    const insertImage = (e) =>
        prevent(e, () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = () => {
                const file = input.files[0];
                if (!file) return;

                const tempUrl = URL.createObjectURL(file);

                editor
                    .chain()
                    .focus()
                    .setImage({
                        src: tempUrl,
                        width: 300,
                        align: 'center',
                        'data-temp': 'true',
                    })
                    .run();

                // store temp image reference
                if (!editor.storage.tempImages) {
                    editor.storage.tempImages = [];
                }

                editor.storage.tempImages.push({
                    file,
                    tempUrl,
                });
            };

            input.click();
        });

    const applyAlign = (align) => {
        // 1️⃣ Image selected
        if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', { align }).run();
            return;
        }

        // 2️⃣ Cursor inside table → align table
        if (editor.isActive('table')) {
            editor.chain().focus().updateAttributes('table', { align }).run();
            return;
        }

        // 3️⃣ Default → align text (paragraph / heading)
        editor.chain().focus().setTextAlign(align).run();
    };


    return (
        <div className="bg-muted/40 flex flex-wrap items-center gap-1 border-b px-2 py-1">
            {/* TEXT */}
            <EditorButton
                tooltip="Bold"
                active={editor.isActive('bold')}
                onClick={(e) => prevent(e, () => editor.chain().focus().toggleBold().run())}
            >
                <Bold size={16} />
            </EditorButton>

            <EditorButton
                tooltip="Italic"
                active={editor.isActive('italic')}
                onClick={(e) => prevent(e, () => editor.chain().focus().toggleItalic().run())}
            >
                <Italic size={16} />
            </EditorButton>

            <EditorButton
                tooltip="Strikethrough"
                active={editor.isActive('strike')}
                onClick={(e) => prevent(e, () => editor.chain().focus().toggleStrike().run())}
            >
                <Strikethrough size={16} />
            </EditorButton>

            <Separator orientation="vertical" className="h-6" />

            {/* HEADINGS */}
            <EditorButton tooltip="Heading 1" onClick={(e) => prevent(e, () => editor.chain().focus().toggleHeading({ level: 1 }).run())}>
                <Heading1 size={16} />
            </EditorButton>

            <EditorButton tooltip="Heading 2" onClick={(e) => prevent(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}>
                <Heading2 size={16} />
            </EditorButton>

            <EditorButton tooltip="Heading 3" onClick={(e) => prevent(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}>
                <Heading3 size={16} />
            </EditorButton>

            <Separator orientation="vertical" className="h-6" />

            {/* LISTS */}
            <EditorButton tooltip="Bullet List" onClick={(e) => prevent(e, () => editor.chain().focus().toggleBulletList().run())}>
                <List size={16} />
            </EditorButton>

            <EditorButton tooltip="Numbered List" onClick={(e) => prevent(e, () => editor.chain().focus().toggleOrderedList().run())}>
                <ListOrdered size={16} />
            </EditorButton>

            <Separator orientation="vertical" className="h-6" />

            {/* BLOCK */}
            <EditorButton tooltip="Blockquote" onClick={(e) => prevent(e, () => editor.chain().focus().toggleBlockquote().run())}>
                <Quote size={16} />
            </EditorButton>

            <EditorButton tooltip="Code Block" onClick={(e) => prevent(e, () => editor.chain().focus().toggleCodeBlock().run())}>
                <Code size={16} />
            </EditorButton>

            <EditorButton tooltip="Horizontal Rule" onClick={(e) => prevent(e, () => editor.chain().focus().setHorizontalRule().run())}>
                <Minus size={16} />
            </EditorButton>

            <Separator orientation="vertical" className="h-6" />

            {/* IMAGE */}
            <EditorButton tooltip="Insert Image" onClick={insertImage}>
                <ImageIcon size={16} />
            </EditorButton>

            {/* IMAGE ALIGNMENT (ONLY WHEN IMAGE IS SELECTED) */}
            <EditorButton tooltip="Align Left" onClick={(e) => prevent(e, () => applyAlign('left'))}>
                <AlignLeft size={16} />
            </EditorButton>

            <EditorButton tooltip="Align Center" onClick={(e) => prevent(e, () => applyAlign('center'))}>
                <AlignCenter size={16} />
            </EditorButton>

            <EditorButton tooltip="Align Right" onClick={(e) => prevent(e, () => applyAlign('right'))}>
                <AlignRight size={16} />
            </EditorButton>

            <Separator orientation="vertical" className="h-6" />

            {/* HISTORY */}
            <EditorButton tooltip="Undo" onClick={(e) => prevent(e, () => editor.chain().focus().undo().run())}>
                <Undo size={16} />
            </EditorButton>

            <EditorButton tooltip="Redo" onClick={(e) => prevent(e, () => editor.chain().focus().redo().run())}>
                <Redo size={16} />
            </EditorButton>
        </div>
    );
}
