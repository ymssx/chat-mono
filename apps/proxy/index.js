const process = require('process');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 其他请求由前端项目处理
app.use(express.static('../client/dist')); // 前端项目目录

// 代理API请求到后端项目
app.use('/api/', createProxyMiddleware('/api/', {
  target: 'http://localhost:7001/', // 后端项目地址
  changeOrigin: true,
}));

const wsProxy = createProxyMiddleware('/socket.io/', {
  target: 'http://localhost:7001/socket.io/', // 后端项目地址
  changeOrigin: true,
  ws: true,
});
app.use(wsProxy);

const server = app.listen(1803, () => {
  console.log('server start', process.env.IS_DEV ? 'dev' : 'prod');
});
server.on('upgrade', wsProxy.upgrade);