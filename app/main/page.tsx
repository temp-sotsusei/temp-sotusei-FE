import { FC } from "react";
import Main from "@/layout/Main";

const Page: FC = () => {
  const calendarStoryData = {
    "2025/10/1": [
      {
        image:
          "https://placehold.jp/3d4070/ffffff/150x150.png?text=test%20Image1",
        title: "test Title1",
      },
    ],
    "2025/10/3": [
      {
        image:
          "https://placehold.jp/3e7051/ffffff/150x150.png?text=test%20Image2",
        title: "test Title2",
      },
      {
        image:
          "https://placehold.jp/703e48/ffffff/150x150.png?text=test%20Image3",
        title: "test Title3",
      },
    ],
  };

  return <Main calenderStoryData={calendarStoryData} />;
};

export default Page;
