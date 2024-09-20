# upupup

一个定期提醒你起来活动筋骨的小应用，来源于runcat，使用electron开发。

资源来自以下项目：
- [runcat](https://kyome.io/runcat/index.html)
- [gnome-runcat](https://github.com/win0err/gnome-runcat)
- [RunCat_for_windows](https://github.com/Kyome22/RunCat_for_windows)
- [runparrot](https://github.com/rainbowflesh/runparrot)


## 效果

![效果](/resources/screen.gif)


## 使用

```bash
# 拉取代码
git clone https://github.com/unclemcz/upupup.git
# 进入目录
cd upupup
# 安装依赖
npm install
# 运行调试
npm start
```

## 编译
默认会打包deb与二进制格式，如果需要打包其他格式，请修改配置文件`forge.config.js`。
```bash
# 打包
npm run make
```
