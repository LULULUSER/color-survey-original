# 原版实验数据收集

GitHub Pages的site目录继续作为不收集回答的展示站。Netlify发布collection目录，使用Netlify Forms处理表单。

## 数据在哪里

在自己的Netlify账号中打开该项目 → Forms。两张表分别为color-similarity-survey和color-language-survey。各表可以在后台导出CSV，数据不会进入GitHub仓库。需同时检查垃圾提交分类；后台实际出现记录才是入库验证依据。

相似性表的responses_json是包含360题回答的JSON文本，含目标/候选/选择的编号及RGB。语言表含color_1_rgb到color_10_rgb及每个显示位置的q1/q2，分析时须按RGB匹配颜色，而不是按显示序号匹配。

两表按participant_id关联，同一浏览器共用匿名编号；submission_id标识一次提交。网络结果不明导致重试时可能重复记录，导出后按submission_id去重。浏览器清存储或换设备会产生新编号；共用设备在入口点“更换参与者”。

## 什么时候保存

保留原版全部完成后统一提交的方式，没有逐题远程保存。提交失败可以留在页面重试；刷新、关闭或崩溃可能丢失尚未提交的回答。只有当前页面内存和匿名ID会在本机保留，未提交答案不写入长期本地存储。

## 部署

Netlify启用Forms的form detection后部署collection目录，确认两张表已被识别。netlify.toml已指定发布目录。代码可留在GitHub，真实答卷只能在私有Netlify后台查看；不要上传答卷CSV到公开仓库。

Netlify的表单额度、项目暂停及费用取决于账号方案，正式发送链接前在后台核对额度。此实现不自动开通付费方案。

后台导出说明：https://docs.netlify.com/manage/forms/submissions/
