import { Stories } from "@/layout/StoryCreator/types";

export type StorySavePostBody = {
  storyTitle: string;
  thumbnailId: string;
  chapters: {
    chapterNum: number;
    chapterJson: Stories;
  }[];
};
