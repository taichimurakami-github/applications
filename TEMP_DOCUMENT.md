# 過去の README.md の保管庫

本ファイルは将来的に削除します。

## アプリケーション利用準備と、アプリケーションのビルド

本アプリケーションの動作には Node.js と npm が必要です。  
まず、node.js をインストールしてください。

### STEP1: `git clone https://github.com/taichimurakami-github/applications.git`

まず、git clone にて必要ファイルをコピーしましょう。

### STEP2: `npm i`

必要なモジュールをインストールします。この手順を飛ばすと STEP3 のビルドでエラーが出ます。

### STEP3: `npm run build`

アプリケーションをビルドします。  
dist フォルダが作成され、その中に**attendance-management Setup (version number).exe**というファイルが作成されれば成功です。  
なお、もしビルドに失敗している場合、以下の点を参照してください。

～エラーが出た時は～  
以下の点を確認してください。

- package.json
  json 内の"main"の項目が以下の設定になっているか確認してください。  
  `"main": "build/electron/main.js"`  
  もし"public/electron/main.js"の場合、上記で上書きしてください。

- 実行コマンドの変更  
  OS 依存のシェルコマンド(&等)を利用したスクリプトがある関係上、何らかのエラーが発生することがあります。  
  `npm-run-all`等を試してみてください。

- dependencies と devDependencies のパッケージがどちらも正しくインストールされているか  
  devDependencies のパッケージを使ってビルドを行います。
