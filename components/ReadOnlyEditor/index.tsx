import { EditorContent, JSONContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CustomWord from "../CustomWord"

type ReadOnlyEditorProps = {
  content: JSONContent
}

const ReadOnlyEditor: React.FC<ReadOnlyEditorProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit, CustomWord],
    content,
    editable: false,  // ← 編集不可にする
    immediatelyRender:false
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}

export default ReadOnlyEditor