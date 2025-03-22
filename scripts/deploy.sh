#!/bin/bash

# 服务器配置
SERVER_HOST="47.120.54.56"
SERVER_USER="root"
SERVER_PATH="/usr/web/vehicle-web"
TEMP_PATH="/usr/web/temp_vehicle"  # 添加临时目录路径
SSH_KEY="/Users/berk/Downloads/nginx_admin.pem"

# 打包项目
echo "开始打包..."
npm run build

# 创建远程目录和临时目录
echo "创建目录..."
ssh -i ${SSH_KEY} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH} ${TEMP_PATH}"

# 上传文件到临时目录
echo "开始上传文件..."
scp -i ${SSH_KEY} -r dist/* ${SERVER_USER}@${SERVER_HOST}:${TEMP_PATH}/

# 设置临时目录权限
echo "设置权限..."
ssh -i ${SSH_KEY} ${SERVER_USER}@${SERVER_HOST} "chmod -R 755 ${TEMP_PATH}"

# 使用原子操作切换目录
echo "切换新旧版本..."
ssh -i ${SSH_KEY} ${SERVER_USER}@${SERVER_HOST} "rm -rf ${SERVER_PATH}_old && mv ${SERVER_PATH} ${SERVER_PATH}_old 2>/dev/null || true && mv ${TEMP_PATH} ${SERVER_PATH} && rm -rf ${SERVER_PATH}_old"  # 添加最后的删除命令

echo "部署完成！"