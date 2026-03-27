🐳 本地安装 Docker 后的完整操作步骤

## 第一步：在 Vue 项目根目录创建 Dockerfile

### 构建阶段
```js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```


## 第二步：构建镜像

```js
docker build -t dong_test:1.0 .
```

## 第三步：登录 TCR 个人版仓库

```js
docker login --username=100036090616 ccr.ccs.tencentyun.com
```

密码输入您之前初始化设置的密码

## 第四步：打标签
```js
docker tag dong_test:1.0 ccr.ccs.tencentyun.com/dong_docker/dong_test:1.0
```

## 第五步：推送镜像
```js
docker push ccr.ccs.tencentyun.com/dong_docker/dong_test:1.0
```
✅ 您的镜像仓库信息汇总

* 登录账号: 100036090616
* 仓库地址: ccr.ccs.tencentyun.com
* 命名空间: dong_docker
* 镜像名称: dong_test
* 完整推送地址: ccr.ccs.tencentyun.com/dong_docker/dong_test:1.0

推送成功后，可在控制台「镜像仓库 → dong_test → 镜像版本」中看到上传的版本 🎉
如果安装 Docker 过程中遇到问题，随时告诉我！