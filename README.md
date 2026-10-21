# Color Survey 原版：展示与数据收集

代码仓库为LULULUSER/color-survey-original。GitHub Pages发布site目录作原版展示；Netlify发布collection目录收集实验回答。

保留最初HTML实验的10个RGB、360题、选择后下一页、固定灰底、原语言问题和提示、Q1/Q2同屏以及原随机顺序和分页方法。没有引入完整版或轻改版功能。只增加入口和展示说明，关闭原Netlify表单提交，完成按钮进入“演示完成”页。

## 数据

本版本不发送回答，不调用收集API、不使用数据库或浏览器持久存储。答案仅存在当前页面内存，离开/刷新页面会丢失。GitHub的站点访问日志与实验回答不同，平台仍可能按其政策记录访问。

收集版使用Netlify Forms，保留原实验任务，增加跨任务共用匿名ID和失败重试。具体字段、查看和导出方法见[DATA_COLLECTION.md](DATA_COLLECTION.md)。

## 发布

仓库Settings → Pages → Build and deployment → Source选择GitHub Actions。推送main后由.github/workflows/pages.yml只发布site目录。

展示站网址：https://lululuser.github.io/color-survey-original/ 。这个地址不收集回答。

本仓库不包含既往参与者数据、CSV、embedding或任何密钥。scripts目录只用于本地预览/检查，不发布到Pages。

上游来源：https://github.com/HornHehhf/color-survey 。本地依据用户提供的color-survey-main代码副本制作。
