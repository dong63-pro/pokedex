#!/bin/bash

# 宝可梦图鉴 - 一键部署脚本
# 支持手动部署和自动化部署

set -e

echo "=== 宝可梦图鉴部署脚本 ==="

# 1. 创建工作目录
echo "创建工作目录..."
mkdir -p /root/pokedex-deploy
cd /root/pokedex-deploy

# 2. 检查是否有 deploy.tar.gz 文件
if [ -f deploy.tar.gz ]; then
    echo "解压文件..."
    tar -xzf deploy.tar.gz
    
    # 3. 构建 Docker 镜像
    echo "构建 Docker 镜像..."
    docker build -t pokedex:latest -f Dockerfile .
    
    # 4. 清理临时文件
    echo "清理临时文件..."
    rm -f deploy.tar.gz
else
    echo "警告: 未找到 deploy.tar.gz 文件，使用本地构建的镜像"
fi

# 5. 停止并移除旧容器
echo "清理旧容器..."
docker rm -f pokedex 2>/dev/null || true

# 6. 运行容器
echo "启动新容器..."
docker run -d -p 80:80 --name pokedex --restart unless-stopped pokedex:latest

# 7. 验证
echo "检查容器状态..."
sleep 3  # 给容器一些启动时间
docker ps | grep pokedex

# 8. 检查容器日志
echo "检查容器日志..."
docker logs pokedex --tail 10

# 9. 输出部署信息
echo "=== 部署完成 ==="
IP_ADDRESS=$(curl -s ifconfig.me || echo "106.54.0.222")
echo "访问地址: http://$IP_ADDRESS"
echo "部署时间: $(date '+%Y-%m-%d %H:%M:%S')"


