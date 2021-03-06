# CSV Server

## 概要

* CSVのデータを放り込んでサクッとRESTで触れるようにしたい
* 基本データのCSVだけ与えれば雑にDBに放り込んで欲しい
    * それ以外の作業はなるべくしたくない
* (optional)とはいえ別途バリデーションもできると良い
    * 別途JSON Schemaなり作る必要はありそう
    * ヘッダに型も書く？→CSVの加工する必要があるとかは微妙
    * サーバは起動時に指定されたフォルダ配下のスキーマ定義を読み込む
    * サーバはスキーマ定義に基づいて、CSVファイルを読み込む

## 機能仕様

### アップロード

* CSVをアップロードしてdbにレコードをぶち込む
    * 1つのCSVがdbの1テーブルに相当する
    * CSVは正規化されている必要は無い
    * サーバはCSVのファイル名をモデル名とみなし、動的にモデルを作成する
    * サーバは各エンティティに対するREST APIをアップロード時に動的に生成する
* データセットの概念を追加する
* ひとつのモデルに対して複数回uploadを呼んでよい
    * CSVのファイル名が重複しているものは
        * 全データを削除して新データで上書き
        * データごとにidが重複していれば上書き

### REST

* /resource/[item]/[id] でRESTできる