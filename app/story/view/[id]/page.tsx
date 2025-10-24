import StoryView from "@/layout/StoryView";

export default async function Page({ params }: { params: { id?: string } }) {
  const storyId = "1";

  const title = `物語 ${storyId}`;
  const chapters = [
    {
      story: `これはストーリー ${storyId} の第1章です。\n複数行も保持します。`,
      words: ["単語A", "単語B", "単語C", "単語D"],
      feedback: "第1章のフィードバックをここに記述します。",
    },
    {
      story: `これはストーリー ${storyId} の第2章です。`,
      words: ["単語E", "単語F", "単語G", "単語H"],
      feedback: "第2章のフィードバックをここに記述します。",
    },
        {
      story: `これはストーリー ${storyId} の第3章です。\n複数行も保持します。`,
      words: ["単語I", "単語J", "単語K", "単語L"],
      feedback: "第3章のフィードバックをここに記述します。",
    },
    {
      story: `これはストーリー ${storyId} の第4章です。`,
      words: ["単語M", "単語N", "単語O", "単語P"],
      feedback: "第4章のフィードバックをここに記述します。",
    },

  ];

  return <StoryView title={title} chapters={chapters} />;
}
