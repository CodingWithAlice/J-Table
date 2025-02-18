一个 J 人热爱统计的生活

1、使用 react 框架初始化

2、项目管理采用 npm workspace（轻量

-   package/Web    存放客户端代码
-   package/server 存放服务端代码

3、项目使用 js ，暂未支持 TS

### 2025.1.18

package/server - 使用 Nestjs 做后端接口

### 2025.2.18 部署到阿里云服务器，前端端口 4001 后端端口 4002

- 给 package/web package/server 添加 dockerfile，分别配置端口
    - server 中修改 main.ts 的 app.listen(4002) 和 跨域配置 corsOptions
    - web 中修改 request 的 baseUrl
