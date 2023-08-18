# 使用Nginx作为基础镜像
FROM nginx:alpine

# 将静态网页文件复制到Nginx的默认网页目录
COPY dist/ /usr/share/nginx/html

# 可选：如果您有自定义的Nginx配置文件，您可以将其复制到镜像中
# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/ /etc/nginx/conf.d
COPY nginx/certs/ /etc/nginx/certs

# 暴露Nginx的默认HTTP端口（通常为80）
EXPOSE 80
EXPOSE 443

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]
