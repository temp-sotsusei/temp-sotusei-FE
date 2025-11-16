import { JSONContent } from "@tiptap/react";

export type Step = "selectWords" | "createStory" | "setTitleThumbnail";

export type Story = {
  id: number;
  story: JSONContent;
  words: string[];
};

export type Stories= Story[];