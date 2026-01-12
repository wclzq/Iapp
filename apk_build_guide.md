# 如何生成安卓 APK (无需安装 Android Studio)

如果你不想在电脑上安装庞大的 Android Studio，最简单的方法是利用 **GitHub Actions** 进行“云端打包”。这意味着你把代码上传到 GitHub，GitHub 的服务器帮你打包好，你直接下载 APK 即可。

## 方法：使用 GitHub 云端构建

我已经在项目中为你准备好了云端构建的配置文件 (`.github/workflows/build.yml`)。你只需要按照以下步骤操作：

### 1. 准备 GitHub 仓库
1. 登录你的 [GitHub](https://github.com) 账号（如果没有请注册一个）。
2. 点击右上角的 **+** 号，选择 **New repository**（新建仓库）。
3. 给仓库起个名字（比如 `moment-app`），保持 Public（公开）或 Private（私有）都可以，点击 **Create repository**。

### 2. 上传代码
回到你的 VSCode，打开终端（Terminal），依次输入以下命令：

```bash
# 初始化 git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 关联远程仓库 (请把下面的 URL 换成你刚才在 GitHub 创建的仓库地址)
git remote add origin https://github.com/wclzq/Iapp.git

# 推送代码
git push -u origin master
```
*(如果 `master` 分支推送失败，尝试使用 `main`：`git branch -M main` 然后 `git push -u origin main`)*

### 3. 等待构建
1. 代码推送成功后，打开你 GitHub 仓库的页面。
2. 点击顶部的 **Actions** 标签页。
3. 你会看到一个名为 **Build Android APK** 的任务正在运行（黄色圆圈转动）。
4. 等待几分钟（通常 3-5 分钟），直到圆圈变成绿色的对勾 ✅。

### 4. 下载 APK
1. 点击那个绿色的任务进入详情页。
2. 在页面底部的 **Artifacts** 区域，你会看到一个名为 `app-debug` 的文件。
3. 点击它，浏览器会下载一个 `.zip` 压缩包。
4. 解压这个压缩包，里面就是你的 `app-debug.apk` 文件！

### 5. 安装
把这个 APK 发送到手机上安装即可。

---

## 替代方案：如果不使用 GitHub

如果不使用 GitHub 也不安装 Android Studio，想要在本地生成 APK 是非常困难的，因为生成 APK 必须依赖 Android SDK（安卓开发工具包）。

你可以尝试使用第三方的“网站打包”服务（搜索 "Web to APK"），通过上传 `dist` 文件夹里的内容来生成，但这种方式**不安全且不推荐**，因为你无法控制对方是否会植入广告或恶意代码。

**强烈建议使用上述的 GitHub Actions 方法，既安全又免费。**