# 更新日志

所有重要的项目变更都会记录在此文件中。

---

## [2026.01.15]

### 新增功能 ✨

- **v2.0：金币机制** 
  - **做题金币规则：**
    - BOX1 初次做题：+2 金币
    - BOX1 隔天重做：+1 金币
    - 其他 BOX（2-6）做题：+1 金币
  - 修改题目答案：每天第一次修改答案 +1 金币
  - 添加新题目成功：+1 金币

---

## [2025.12.06]

### 新增功能 ✨

- 提供筛选最小日期功能，便于按计划做题 

### 问题修复 🐛

- mongodb 由于磁盘占满数据覆盖，导致历史数据全部丢失 😭

---

## [2025.06.26]

### 功能优化 🔧

- 线轴信息不采用手工录入，改为数据库数据管理
- 校验做题答案时，接入 Deepseek 便于排查、修正 

---

## [2025.05.05]

### 新增功能 ✨

- 添加隔天重做入口，利用记忆曲线加强知识点的记忆 
- 添加当日做题记录查询入口，方便复盘

---

## [2025.03.04]

### 功能优化 🔧

- 将服务器 docker 数据迁移到数据盘 
  - 首先要停止 Docker 服务，然后将 `/var/lib/docker` 目录下的数据备份并迁移到数据盘的合适位置
  - 接着修改 Docker 的配置文件，一般在 `/etc/docker/daemon.json` 中添加或修改 `"data-root": "/test"`，指定新的数据目录
  - 最后启动 Docker 服务，检查是否正常运行，并且数据是否正确存储在新的位置

### 新增功能 ✨

- J-Table 添加权限校验 - 守卫
- nginx 配置处理 `http://codingwithalice.top:4001`

---

## [2025.02.26]

### 功能优化 🔧

- 配置 nginx，方便不携带端口访问 - 在 NextJS 项目中添加 nginx 配置
  - `http://codingwithalice.top/` 可以直接访问

```bash
# 使用 docker-compose
sudo docker pull nginx # 安装 nginx
```

---

## [2025.02.18]

### 部署 🚀

- J-Table 部署到线上

---

## [2025.02.02]

### 部署 🚀

- 部署至云端数据库（服务器默认安装了 Docker 环境 - 提供了容器化的部署方式）

```bash
# check docker 安装
docker --version # Docker version 26.1.3, build b72abbb
```

---

## [2025.01.25]

### 功能优化 🔧

- 清理博客和印象笔记中的「LTN题目」管理Tag 和列表
- J-Table：新增添加 Box 弹窗 + 统一管理所有题目和周期

---

## [2025.01.23]

### 功能优化 🔧

- J-Table：展示周期 + 切换LTN/all 展示

---

## [2025.01.22]

### 基础设施 🏗️

- 买域名 `codingwithalice.top` + 买轻量应用服务器（4个月，得到 ICP 备案资格，并提交备案）

---

## [2025.01.20]

### 功能规划 📋

- LTN工具未来迭代方向：结合记忆曲线，在遗忘曲线的周期内，对知识进行回顾

### 新增功能 ✨

- J-Table
  - 前端路由 + 莱特纳盒子
  - `/ltn` 查询接口，按 boxId 分组返回 + 前端侧按盒子分组展示
  - `/ltn/operate` 修改接口，升/降LTN内容 + 前端侧提供按钮
  - 提供过滤接口，生成当前周期的 LTN 题库

---

## [2025.01.18]

### 新增功能 ✨

- J-Table 后端服务使用 nestjs 初始化
- 快速打通数据库，提供查询接口

---

## [2025.01.17]

### 需求梳理 📋

J-Table 后端接口需求梳理：

**表结构：**

```sql
CREATE TABLE `ltn_data` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '题目标题',
  `source` BIGINT NOT NULL COMMENT '题目来源作业/博客',
  `box_id` BIGINT NOT NULL COMMENT '归属box',
  `solve_time` TIME NOT NULL COMMENT '做题时间',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
)
```

**接口：**

1. 查询接口 `/findAll` 按 `box_id` 分组
2. 某题操作按钮 `/operate` 参数：`id` + `type:upgrade[box_id+1]/degrade[box_id降为1]`
3. 过滤接口 `/filter` 参数：`startTime` + `endTime[solve_time+box_id*7∈[start,end]]`
   - 建议 `startTime: now` `endTime: now+10天`（一个周期）

---

## 图例说明

- ✨ 新增功能
- 🔧 功能优化
- 🐛 问题修复
- 🚀 部署相关
- 🏗️ 基础设施
- 📋 需求/规划
