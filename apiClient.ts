type postChapterResponse = string[][];
export const postChapter = async (
  chapterText: string
): Promise<postChapterResponse> => {
  const response = await fetch("/api/story/chapter/next", {
    method: "POST",
    body: JSON.stringify({
      chapterText,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("postChapterでのエラー");
  }
};
