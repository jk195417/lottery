# Lottery 抽獎小工具

聖誕節、尾牙用的網頁抽獎工具：<https://yang-hong-xin.com/lottery>

1. 左邊「設定面板」設定號碼範圍（例如 1 ~ 100）和動畫時間。
2. 右邊「新增禮物」輸入禮物名稱、數量和照片連結。
3. 在中獎名單點選要抽的禮物，再點聖誕老人抽獎。已抽過的號碼不會重複。
4. 點中獎號碼可以標記「已領獎」；點齒輪可以編輯禮物或刪除中獎號碼。

資料會自動存在瀏覽器裡，重新整理也不會不見；也可以「匯出」成 JSON 備份，之後再「匯入」（2019 年版本匯出的檔案也能匯入）。

## Development

需要 Node.js 22 以上。

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm test
npm run build
```

push 到 `main` 後，GitHub Actions 會跑型別檢查與測試，再 build 並部署到 `gh-pages`。

Built with [Vue 3](https://vuejs.org), [Pinia](https://pinia.vuejs.org), [TypeScript](https://www.typescriptlang.org), [Vite](https://vite.dev), [Bootstrap 5](https://getbootstrap.com), [Font Awesome](https://fontawesome.com), [Animate.css](https://animate.style) and [Vitest](https://vitest.dev). Font: [源柔ゴシック](http://jikasei.me/font/genjyuu/) (SIL Open Font License).
