一个 J 人热爱统计的生活

1、使用 react 框架初始化

2、项目管理采用 npm workspace（轻量

-   package/Web    存放客户端代码
-   package/server 存放服务端代码

3、本地启动项目

```js
    npm run dev:iterm
```

> 开发 tips：后端接口所有数据统一包裹在 data 属性中返回

### 2025.1.18

package/server - 使用 Nestjs 做后端接口

### 2025.2.18 部署到阿里云服务器，前端端口 4001 后端端口 4002

- 给 package/web package/server 添加 dockerfile，分别配置端口
    - server 中修改 main.ts 的 app.listen(4002) 和 跨域配置 corsOptions
    - web 中修改 request 的 baseUrl
- 在根目录添加 docker-compose.yml 用于定义和配置服务

- step1: 添加到 gitee 同步
https://gitee.com/CodingWithAlice/J-Table

- 服务器上已经安装了 docker-compose，但是无权访问
使用 chmod 命令为文件添加执行权限
```shell
sudo chmod +x /usr/local/bin/docker-compose
```

- step2: 构建 + 启动 Docker 镜像
```js
sudo /usr/local/bin/docker-compose build
sudo /usr/local/bin/docker-compose up -d
sudo /usr/local/bin/docker-compose ps
```

- step3: 停止服务 - 会停止并移除所有由 docker-compose up 启动的容器
```js
sudo /usr/local/bin/docker-compose down
sudo /usr/local/bin/docker-compose build
sudo /usr/local/bin/docker-compose up -d
// 可以合并为
sudo /usr/local/bin/docker-compose down && docker-compose up --build -d
// 定时清理不使用的镜像
sudo su -
docker system prune -f
```
```js
sudo docker logs j-table-react-client-1
sudo /usr/local/bin/docker-compose logs nestjs-server
// 实时监听错误
sudo /usr/local/bin/docker-compose logs -f nestjs-server
```

- step4: 运行过程中查看接口调用日志
```js
sudo /usr/local/bin/docker-compose logs -f nestjs-server 
```
