---
title: "2つ目の記事"
date: "2024-06-02"
---

## 2つ目の記事

## 解決方法

### 1. 強制インストール（`--legacy-peer-deps`）

このオプションを使うと、peer dependencyの警告を無視してインストールできます。

```sh
<code_block_to_apply_changes_from>
```

### 2. react-deviconを使っていない場合はアンインストール

もし`react-devicon`を使っていなければ、先にアンインストールしてから再度`npm install front-matter`を試してください。

```sh
npm uninstall react-devicon
npm install front-matter
```

---

### 3. 依存関係の整理

- 依存関係の衝突が多い場合は、一度`node_modules`と`package-lock.json`を削除してから再インストールするのも有効です。

```sh
rm -rf node_modules package-lock.json
npm install
npm install front-matter --legacy-peer-deps
```

---

## 注意

- `--legacy-peer-deps`でインストールした場合、依存関係の一部が壊れる可能性がありますが、`front-matter`自体はReactや他のパッケージに依存しないため、ほとんどの場合問題なく動作します。
- ただし、`react-devicon`を使っている場合は、将来的な互換性に注意してください。

---

### まずは下記コマンドをお試しください

```sh
npm install front-matter --legacy-peer-deps
```

エラーや警告が出た場合は、その内容を教えてください。
