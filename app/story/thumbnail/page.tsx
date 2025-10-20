import type { FC } from "react";
import ThumbnailDecision from "@/layout/ThumbnailDecision";

/**
 * 物語作成後のサムネイル決定ページ。
 * /story/thumbnail にアクセスすると ThumbnailDecision が表示されます。
 */
const Page: FC = () => {
  return <ThumbnailDecision />;
};

export default Page;
