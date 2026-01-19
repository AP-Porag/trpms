import { Separator } from '@/components/ui/separator';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Table as TableIcon, Trash } from 'lucide-react';

import EditorButton from './EditorButton';

export default function TableToolbar({ editor }) {
    if (!editor) return null;

    const prevent = (e, cb) => {
        e.preventDefault();
        e.stopPropagation();
        cb?.();
    };

    const isTableActive = editor.isActive('table');

    return (
        <div className="flex flex-wrap items-center gap-1 border-b bg-blue-50 px-2 py-1">
            {/* INSERT TABLE — ALWAYS AVAILABLE */}
            <EditorButton
                tooltip="Insert table (3×3)"
                onClick={(e) =>
                    prevent(e, () =>
                        editor
                            .chain()
                            .focus()
                            .insertTable({
                                rows: 3,
                                cols: 3,
                                withHeaderRow: true,
                            })
                            .run(),
                    )
                }
            >
                <TableIcon size={16} />
            </EditorButton>

            {/* CONTEXTUAL CONTROLS — ONLY WHEN INSIDE TABLE */}
            {isTableActive && (
                <>
                    <Separator orientation="vertical" className="h-6" />

                    {/* ROW CONTROLS */}
                    <EditorButton tooltip="Add row above" onClick={(e) => prevent(e, () => editor.chain().focus().addRowBefore().run())}>
                        <ArrowUp size={16} />
                    </EditorButton>

                    <EditorButton tooltip="Add row below" onClick={(e) => prevent(e, () => editor.chain().focus().addRowAfter().run())}>
                        <ArrowDown size={16} />
                    </EditorButton>

                    <EditorButton tooltip="Delete row" onClick={(e) => prevent(e, () => editor.chain().focus().deleteRow().run())}>
                        <Trash size={16} />
                    </EditorButton>

                    <Separator orientation="vertical" className="h-6" />

                    {/* COLUMN CONTROLS */}
                    <EditorButton tooltip="Add column left" onClick={(e) => prevent(e, () => editor.chain().focus().addColumnBefore().run())}>
                        <ArrowLeft size={16} />
                    </EditorButton>

                    <EditorButton tooltip="Add column right" onClick={(e) => prevent(e, () => editor.chain().focus().addColumnAfter().run())}>
                        <ArrowRight size={16} />
                    </EditorButton>

                    <EditorButton tooltip="Delete column" onClick={(e) => prevent(e, () => editor.chain().focus().deleteColumn().run())}>
                        <Trash size={16} />
                    </EditorButton>

                    <Separator orientation="vertical" className="h-6" />

                    {/* DELETE TABLE */}
                    <EditorButton tooltip="Delete table" onClick={(e) => prevent(e, () => editor.chain().focus().deleteTable().run())}>
                        <Trash size={16} />
                    </EditorButton>
                </>
            )}
        </div>
    );
}
