# 出席管理アプリ
とある塾の自習室の出席管理システムとして作成したアプリです。  
Create-react-appで作成したアプリのひな型に、electronでwindowsデスクトップアプリケーションとしてビルドしています。  
動作環境：windows 10(x64)上のみ動作を確認、Linux、mac上ではインストールできません。  

最新安定バージョン：0.9.5  
作成日：2021/7/30  
作成期間：開発：約2～3週間


## アプリケーション利用準備と、アプリケーションのビルド
本アプリケーションの動作にはNode.jsとnpmが必要です。  
まず、node.jsをインストールしてください。

### STEP1:`git clone https://github.com/taichimurakami-github/applications.git`
まず、git cloneにて必要ファイルをコピーしましょう。

### STEP2: `npm start`
コマンドを実行すると、development build状態でアプリを走らせることができます。
**(ATTENTION!!) Node.jsのfs機能を使用するため、デバッグ、実行共に通常のChrome等の上では行えません。**  

### STEP3: `npm i`
必要なモジュールをインストールします。この手順を飛ばすとSTEP4のビルドでエラーが出ます。

### STEP4: `npm run build`
アプリケーションをビルドします。  
distフォルダが作成され、その中に**attendance-management Setup (version number).exe**というファイルが作成されれば成功です。  


<エラーが出た時は>  
以下の点を確認してください。  
+ package.json
json内の"main"の項目が以下の設定になっているか確認してください。  
もし"public/electron/main.js"の場合、以下で上書きしてください。　　
`"main": "build/electron/main.js"`

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

config.json  
attendance/  
  (年度)(月)(日).json  
seats/  
  (年度)(月)(日).json  

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