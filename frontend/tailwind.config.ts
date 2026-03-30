// tailwind.config.ts
// 「Tailwindに自分だけのオリジナル色を登録する設定ファイル」

const config = {
  theme: {
    extend: {
      // extend = 「今あるTailwindの色に追加する」という意味
      colors: {
        // primary = メインカラー（パープル系）
        // 「primary.DEFAULT」= bg-primary と書いたときに使われる色
        primary: {
          DEFAULT: "#534AB7", // ボタン・リンクのメイン色
          light: "#EEEDFE", // 薄い背景（バッジ・カード背景）
          dark: "#3C3489", // ホバー時・強調
          darker: "#26215C", // ページタイトル文字
        },
        // accent = サブカラー（ティール系・AIバッジ・成功）
        accent: {
          DEFAULT: "#1D9E75", // 高マッチバッジ・完了
          light: "#E1F5EE", // 薄い背景
          dark: "#0F6E56", // テキスト用
        },
      },
      // borderRadius = 角の丸さの設定
      borderRadius: {
        card: "12px", // カードに使う角丸
        btn: "8px", // ボタンに使う角丸
        pill: "9999px", // バッジ・タグに使う丸角
      },
    },
  },
};

export default config;
