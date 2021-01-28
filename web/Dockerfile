FROM nginx:1.17	

# Nginx conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

# make keys
# RUN /etc/nginx/ssl
# RUN sudo yum install -y openssl
# RUN sudo openssl genrsa -out /etc/nginx/ssl/server.key 2048
# RUN sudo openssl req -new -key /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.csr

# make Nginx listen to 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]