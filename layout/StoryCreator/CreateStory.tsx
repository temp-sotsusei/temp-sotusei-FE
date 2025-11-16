'use client'

import CustomWord from '@/components/CustomWord';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { FC, useEffect, useRef, useState } from 'react'

function DraggableWord({ id, word, isUsed }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { word },
    disabled: isUsed,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        ${isUsed 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
          : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-grab'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
      style={{ touchAction: 'none' }}
    >
      {word}
    </button>
  );
}

function EditorDropZone({ editor, hasError }: { editor: any, hasError: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'editor-drop-zone',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`
        border-2 border-dashed rounded-lg min-h-[200px] transition-colors
        ${isOver 
          ? 'border-blue-500 bg-blue-50' 
          : hasError 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-gray-50'}
      `}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

type Props = {
  words: string[],
  usedWords: Set<string>,
  storyIndex: number
  story: JSONContent,
  storyTextLength: number,
  errorText: string,
  updateStory: (story:JSONContent) => void
}

const CreateStory: FC<Props> = ({ words, usedWords, storyIndex, story, storyTextLength, errorText, updateStory }) => {
  const [mounted, setMounted] = useState(false);
  const [activeWord, setActiveWord] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomWord,
    ],
    content: story,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[200px] p-4 text-black',
      },
    },
    onUpdate: (e) => {
      console.log(e.editor.getJSON())
      updateStory(e.editor.getJSON())
    },
    immediatelyRender: false
  });
  
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragStart = (event) => {
    editor.view.dom.blur()
    requestAnimationFrame(() => {
      setActiveWord(words[event.active.id]);
    });
  };

  const currentPosRef = useRef({ x: 0, y: 0 }); // 現在のマウス/タッチ位置

  // マウス/タッチの現在位置を常に追跡
  useEffect(() => {
    const updatePos = (e) => {
      currentPosRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const updateTouchPos = (e) => {
      if (e.touches[0]) {
        currentPosRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
      }
    };

    window.addEventListener('mousemove', updatePos);
    window.addEventListener('touchmove', updateTouchPos);
    
    return () => {
      window.removeEventListener('mousemove', updatePos);
      window.removeEventListener('touchmove', updateTouchPos);
    };
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id === 'editor-drop-zone' && editor) {
      
      const word = active.data.current.word;
      
      const { x, y } = currentPosRef.current;
      
      const pos = editor.view.posAtCoords({ left: x, top: y });
      console.log(pos)
      const content = { type: 'customWord', attrs: { text: word, droppedId: 1} };
      if (pos && pos.inside != -1) {
        console.log(editor.getJSON())
        editor.chain().insertContentAt(pos.pos, content).run();
      } else {
        const endPos = editor.state.doc.content.size-1;
        editor.chain().insertContentAt(endPos, content).run();
      }
    }
    
    setActiveWord(null);
  };

  if (!mounted) {
    return (
      <div className='h-full p-4'>
        <div className='bg-white flex flex-col items-center h-full px-4 pt-8 space-y-4 rounded-xl'>
          <p className='text-lg font-bold'>ものがたり<span className='text-base mx-1'>を</span>つくろう！</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <p className='text-lg font-bold'>ものがたり<span className='text-base mx-1'>を</span>つくろう！</p>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* 文章エリア（ドロップゾーン） */}
        <div
          id="editor-drop-zone"
          className="bg-white rounded-xl shadow-lg p-6 w-full"
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              📝 だい{storyIndex}わ
            </h2>
          </div>
          
          <EditorDropZone editor={editor} hasError={errorText != null && errorText.trim() !== ""} />
          {storyTextLength}
        </div>

        {/* 単語パレット */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            単語パレット
          </h2>
          <div className="flex flex-wrap gap-3">
            {words.map((word, index) => (
              <DraggableWord
                key={index}
                id={index}
                word={word}
                isUsed={usedWords.has(word.toLowerCase())}
              />
            ))}
          </div>
        </div>

        {/* ドラッグオーバーレイ */}
        <DragOverlay>
          {activeWord ? (
            <div className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium shadow-lg">
              {activeWord}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}

export default CreateStory