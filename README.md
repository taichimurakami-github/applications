# 出席管理アプリ
とある塾の自習室の出席管理システムとして作成したアプリです。  
Create-react-appで作成したアプリのひな型に、electronでwindowsデスクトップアプリケーションとしてビルドしています。  
動作環境：windows 10(x64)上のみ動作を確認、Linux、mac上ではインストールできません。  

最新安定バージョン：0.9.11

## 最新更新情報
### ver 0.9.11 (2021/9/10)
#### 1. Top画面にお知らせを表示できるようになりました。  
暫定的に実装しました。フィードバック次第で改装していきます。  

#### 2. 設定画面のスタイル変更と、Top画面のメッセージ編集機能を実装しました。  
設定画面からTOPのお知らせを編集できます。  
設定画面の項目が増えたので、スタイルを調整しました。  
なお、設定画面は将来的に変更される可能性があります。  

#### 3. main.tsをmain.jsに戻しました
全くTypeScriptの意味がないコードになっていたので、jsファイルに戻しました。  
将来的にtsファイルに変更する可能性があります。  

### ver 0.9.10 (2021/9/10)
#### 1. 暫定的にTypeScript化しました  
部分的に間に合わせのコードが多々あるので、徐々にちゃんとした感じに直していきたいと思います。
1ヶ月くらいかけてのんびりやります

### ver 0.9.9 (2021/9/2)
#### 1. 座席操作機能を強化：座席移動ができるようになりました  
座席移動を行うか、退席操作を行うかをGUI上で選択できる様になりました。  
今まで「退席する」だったボタンが、「座席の操作」ボタンになりました。

#### 2. 着席している生徒に関して、入室時間が保持されるようになりました。  
これによて、座席操作画面上で入室時間が表示されるようになりました。  

#### 3. 自動アップデート時に生徒名簿リストのファイルのパス等のデータが保持されるようになりました。  
バージョン変更時、ローカルに保持されていたファイルのパスはそのまま自動でコピーされます。  

#### 4. その他、スタイル等調整を行いました。  
アプリのスタイルを修正しました。  


### ver 0.9.8(nightly) (2021/8/29)
#### 1. これまでapp.config.jsから設定していた項目を、アプリの設定メニューからGUIで変更できる様になりました  
新たに「アプリ1日分内部データ削除機能」と、「直前操作取り消し機能」を、設定画面から有効化/無効化できるようになりました。  
実装途中の機能です。今後、内部的な仕様は変更予定です。


#### 2. 同様に、手動で設定する項目に関して、ローカルファイルへバックアップを取るようになりました。  
検証不足なため、不安定な恐れのある機能です。stable版をお待ち下さい。

#### 3. アプリ起動時、バックアップしているアプリ設定項目を自動で復元する機能を追加しました。  
検証不足なため、不安定な恐れのある機能です。stable版をお待ち下さい。

**nightly版はそのままではビルドできないため、以下の2点を変更した上で`npm run build`を実行してください。**  
+ package.jsonのmainプロパティを`"main":"build/electron/main.js"`へ変更  
+ package.jsonのversionプロパティを`"version": "0.9.8"`へ変更


## アプリケーション利用準備と、アプリケーションのビルド
本アプリケーションの動作にはNode.jsとnpmが必要です。  
まず、node.jsをインストールしてください。

### STEP1: `git clone https://github.com/taichimurakami-github/applications.git`
まず、git cloneにて必要ファイルをコピーしましょう。

### STEP2: `npm i`
必要なモジュールをインストールします。この手順を飛ばすとSTEP3のビルドでエラーが出ます。

### STEP3: `npm run build`
アプリケーションをビルドします。  
distフォルダが作成され、その中に**attendance-management Setup (version number).exe**というファイルが作成されれば成功です。  
なお、もしビルドに失敗している場合、以下の点を参照してください。  

～エラーが出た時は～  
以下の点を確認してください。  

+ package.json
json内の"main"の項目が以下の設定になっているか確認してください。  
`"main": "build/electron/main.js"`  
もし"public/electron/main.js"の場合、上記で上書きしてください。　　

+ 実行コマンドの変更  
OS依存のシェルコマンド(&等)を利用したスクリプトがある関係上、何らかのエラーが発生することがあります。  
`npm-run-all`等を試してみてください。  

+ dependenciesとdevDependenciesのパッケージがどちらも正しくインストールされているか  
devDependenciesのパッケージを使ってビルドを行います。


## アプリケーションのインストールと実行

### STEP1: Setup.exeを起動
先ほどのSTEP4で作成したsetup.exeをクリックし、インストールしてください。  

### STEP2: アプリを起動
windowsの場合、インストール完了後にデスクトップにアプリのショートカットアイコンが追加されます。それをクリックすると、アプリが起動できます。  

なお、アプリ本体のexeファイルは以下のパス内に保存されています。  
`~\AppData\Local\Programs\attendance-management\attendance-management.exe`

その他、実行可能なnpmコマンドがいくつかあります。詳細はpackage.jsonを確認してください。

## アプリケーションの仕様
### 構成
package.jsonを参照のこと

### アプリケーション起動時
**`~\AppData\Roaming\attendance-management`**  

フォルダ内に、

+ アプリ内ローカルデータ(設定ファイル、出席記録、アプリケーション状態のバックアップファイル)
+ アプリ本体とその他ビルド関係のファイル

が出力されています。  
アプリ内ローカルデータは以下のディレクトリに保存されています。  

**`~\AppData\Roaming\attendance-management\appLocalData\`**  

このフォルダ内の構造は、以下のようになっています。  

+ config.json  
+ attendance/ (年度)(月)(日).json    
+ seats/ (年度)(月)(日).json   

#### config.jsonについて
アプリケーションの状態をローカルで保存するためのファイルです。基本的にいじらないでください。  
書き出しはアプリケーション側から自動的に行われます。  
主に外部ファイルの書き出し先、あるいは必要データの読み込み先のパスなどが格納されています。

#### attendanceフォルダについて  
生徒の出席記録をjson形式で出力するフォルダです。  
ファイル名は、アプリを使用した年度と日付となります。  
なお、JSの仕様上、日付は一桁でも "0" が入りません。  

+ ex) 2021年8月2日に使用した場合："202182.json"というファイルが作成される  

**出席記録を統計処理する際は、このディレクトリを参照してください。**

#### seatsフォルダについて
アプリケーションの内部状態のバックアップとなるデータを格納します。いじらないでください。

## 不具合などの対応
### version 0.9.5
1. バックアップファイル読み込み時に不具合がある(？)  
日付をまたいで、バックアップファイルが一新されるタイミングで何らかの不具合が起こることがあります。  
再現性がないため、現在検証中です。キャッシュ関係の可能性もあるため、アプリの再インストールを行ってください。  
なお、再インストールを行っても出席データなどは削除されません。