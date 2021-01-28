FROM nginx:1.17	

# Nginx conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

# make Nginx listen to 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]