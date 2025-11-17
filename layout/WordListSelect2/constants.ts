// 変更: マジックナンバーを定数化して意図を明確に

// 章ごとに必要なキーワード数
export const REQUIRED_KEYWORDS_PER_CHAPTER = 4;

// 作成可能な最大章数
export const MAX_CHAPTERS = 4;

// 1章あたりの最大文字数（既存のMAX_CHAPTER_CHARSをここに移動することを推奨）
export const MAX_CHAPTER_CHARS = 200;

// ドロップ位置の計算用オフセット
// カーソル位置の後にドロップする際のオフセット値
export const DROP_POSITION_OFFSET = 2;