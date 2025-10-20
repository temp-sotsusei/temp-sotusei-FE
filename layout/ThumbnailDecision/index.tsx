// Next.js の App Router ではファイルがデフォルトでサーバー側で実行されるため、
// 入力フォームやクリックイベントが正しく動くようにこのコンポーネントを
// クライアントサイド専用に指定します。
"use client";

import type { FC } from "react";
// このコンポーネントではサムネイル選択状態を管理していないため、状態管理用の
// useState フックは使用していません。選択状態によって見た目を変える場合は
// useState を導入して選択インデックスを保持してください。
import Image from "next/image";
import { APP_TITLE } from "@/constants";

/**
 * サムネイル決定用のシンプルなコンポーネントです。
 * 12枚のサムネイル画像をプレースホルダーとして生成し、
 * 「アプリ名 → タイトル入力 → サムネイル一覧 → 保存ボタン」の順に縦並びで配置します。
 * 実際のサムネイルの選択や保存処理はこのコンポーネントの外側で実装してください。
 */
const ThumbnailDecision: FC = () => {
  // 選択状態は管理しないので状態フックはありません。
  // 12 個のプレースホルダー画像 URL を生成します。
  const thumbnails = Array.from({ length: 12 }).map(
    (_, index) =>
      // 画面が大きい場合にも縦方向に広がるように大きめのサムネイルを使用します。
      `https://placehold.jp/ffffff/000000/300x300.png?text=${index + 1}`
  );

  return (
    <div
      /*
       * 最外層のコンテナ。Flexbox で縦方向に要素を並べ、中央寄せにしています。
       * px-* は左右の内側余白、py-* は上下の内側余白を表し、画面幅が広いほど余白を増やします。
       * space-y-* で子要素間の縦方向の間隔を設定し、medium 以上の画面ではやや間隔を広げています。
       */
      className="flex flex-col items-center w-full px-4 sm:px-6 md:px-10 lg:px-16 py-8 space-y-8 md:space-y-9"
    >
      {/* アプリ名。画面サイズに応じてフォントサイズを大きくします */}
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        {APP_TITLE}
      </h1>

      {/*
       * 物語のタイトル入力欄。画面幅によって横幅が変わります。
       * フォントサイズもデバイスに合わせて少しずつ大きくしています。
       */}
      <input
        type="text"
        placeholder="物語のタイトルを入力"
        className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 p-2 sm:p-3 md:p-4 text-base sm:text-lg md:text-xl border border-gray-300 rounded-md"
      />

      {/* サムネイル選択エリア全体を囲う枠。画面が大きくなるほど横幅を広げます */}
      <div
        /*
         * 中型以上の画面では幅を 80% (md), 75% (lg), 66% (xl) に設定し、
         * グリッド内のサムネイルが大きく表示されるようにしています。
         * space-y-* や p-* によって枠内の余白を調整します。
         */
        className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto space-y-2 sm:space-y-3 md:space-y-4 border border-gray-300 rounded-md p-3 sm:p-4 md:p-5"
      >
        {/* ラベル。画面幅に応じて文字サイズを大きくします */}
        <p className="font-medium text-sm sm:text-base md:text-lg">
          サムネイルを選択
        </p>
        {/* サムネイル一覧を 3 列で表示するグリッド。画面サイズが大きいほど画像間の余白を広げます */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {thumbnails.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-square border rounded-md overflow-hidden bg-white"
            >
              <Image
                src={src}
                alt={`サムネイル ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 保存ボタン。画面サイズに合わせて文字サイズを調整します */}
      <button className="mt-4 py-4 px-12 font-bold text-base sm:text-lg md:text-xl text-white bg-blue-500 rounded-md hover:bg-blue-600">
        保存
      </button>
    </div>
  );
};

export default ThumbnailDecision;
