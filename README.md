## 初期設定

1. リポジトリをクローン
2. プロジェクトのルートディレクトリに移動
   ```sh
   $ cd <project_root>
   ```
   ```sh
   $ pwd
   <path to project>/mynumber-form
   ```
3. パッケージをインストール
   ```sh
   $ npm install
   ```
4. ローカルサーバーを起動
   ```sh
    $ npm start
   ```

5. deploy
   ```sh
   gcloud run deploy
   ```
   こちらがgcloudコマンドの[リファレンス](https://cloud.google.com/sdk/gcloud/reference/run)  
   regionは4(asia-northeast1==Tokyo)がおすすめです

## Author

2024 kento tokura
