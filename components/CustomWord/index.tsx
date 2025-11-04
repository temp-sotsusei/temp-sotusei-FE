import { UniqueIdentifier } from "@dnd-kit/core";
import { Node, mergeAttributes, CommandProps } from "@tiptap/core";

export interface CustomWordOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customWord: {
      insertCustomWord: (
        text: string,
        droppedId: UniqueIdentifier,
        position?: number
      ) => ReturnType;
    };
  }
}

/**
 * 「1つの単語を不可分な塊として扱う」Tiptap カスタムノード
 */
const CustomWord = Node.create<CustomWordOptions>({
  name: "customWord",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true, // ← 中にカーソルを置けなくするポイント

  addAttributes() {
    return {
      text: {
        default: "",
      },
      droppedId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "span.custom-word" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "custom-word",
      }),
      node.attrs.text,
    ];
  },

  addCommands() {
    return {
      insertCustomWord:
        (text: string, droppedId: UniqueIdentifier, position?: number) =>
        ({ chain }: CommandProps) => {
          const content = { type: this.name, attrs: { text, droppedId } };

          // position が指定されていればその位置に挿入
          if (typeof position === "number") {
            return chain().focus().insertContentAt(position, content).run();
          }

          // 位置指定なしなら現在のカーソル位置に挿入
          return chain().focus().insertContent(content).run();
        },
    };
  },
});

export default CustomWord;
