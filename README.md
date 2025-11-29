# ASTA_agentclient
前端。

值得注意的是，目前services文件夹内的mockGameEngine.ts仅仅是在自行生成数据以供前端测试，尚不具备与后端通信的能力，需要补充一个apiService.ts文件以接收后端返回的数据。


请按以下步骤运行：


**一、确认已安装 Node.js**（建议 v18+）。在 PowerShell 中运行：
```shell
node -v
npm -v
```
如果没有 Node.js，请安装：https://nodejs.org/

**二、安装依赖**。在项目根目录执行：
```shell
npm install
```

**三、启动开发服务器**（本地热重载，最快开始开发与调试）。在项目根目录执行：
```shell
npm run dev
```
说明：默认 Vite 配置在 vite.config.js 中指定 host: '127.0.0.1' 与 port: 5173，所以打开浏览器访问 http://127.0.0.1:5173 （或 http://localhost:5173 ）即可看到交互页面。
