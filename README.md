# MOVE BEYOND（架空デモサイト）

スポーツ・パフォーマンス系施設の架空デモサイトです。HTML / CSS / JavaScript のみの1ページ構成。

- `index.html` … ページ本体
- `style.css` … スタイル（スマホファースト）
- `script.js` … メニュー開閉・スクロール演出・デモ用フォーム（プログラム選択の連動・入力チェック・送信しない完了画面）
- `images/` … 画像（現在は仮画像）

## GitHub Pages で公開する

1. リポジトリの **Settings → Pages** を開く
2. **Source** を「Deploy from a branch」にする
3. Branch に公開したいブランチ、フォルダに `/ (root)` を選んで Save

数分後に `https://<ユーザー名>.github.io/move-beyond/` で表示されます。

## 画像の差し替え

画像はすべて `images/` フォルダにあります。今入っているのは SVG で作ったモノクロの仮画像です（外部画像は使っていません）。

| ファイル | 場所 | 入れる写真 | 縦横比 |
|---|---|---|---|
| `images/hero.svg` | ファーストビュー | スプリント・ジャンプ | 3:2（スマホでは横長に切り抜き） |
| `images/program-strength.svg` | PROGRAM 01 | 筋力トレーニング | 3:2 |
| `images/program-conditioning.svg` | PROGRAM 02 | コンディショニング | 3:2 |
| `images/program-assessment.svg` | PROGRAM 03 | 動作評価 | 3:2 |
| `images/trainer-01.svg` 〜 `trainer-03.svg` | TRAINER | ポートレート（3人とも同じ背景・明るさ・距離感で撮影） | 4:5 |
| `images/access-interior.svg` | ACCESS | 施設の内観 | 3:2 |
| `images/access-map.svg` | ACCESS | 地図の仮画像（住所が架空のため実際の地図は埋め込まない） | 3:2 |

### 手順

1. 写真を `images/` に入れる（例：`images/hero.jpg`）。目安は横長 1500×1000px、縦長 800×1000px 以上
2. `index.html` で該当する `<img src="images/○○.svg">` の `src` を写真のファイル名に変える
3. `alt`（写真の説明文）の末尾の「（仮画像）」を消し、写真の内容に合わせて書き換える

- 画像は `object-fit: cover` で枠いっぱいに表示されるので、縦横比が少し違っても枠からはみ出したり歪んだりしません（はしは切り取られます）
- 写真の上に出ている「写真：○○」のラベルは、`src` が `.svg` 以外になると自動で消えます。不要なら `<span class="media__note">…</span>` を削除してもかまいません
- 切り取られる位置を変えたいときは、その `<img>` に `style="object-position: 50% 30%;"` のように指定します

※ 本サイトに掲載の施設・人物・料金・お客様の声はすべて架空です。
