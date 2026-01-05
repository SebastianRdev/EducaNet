FROM node:20-alpine AS build
WORKDIR /app
COPY EducaNet.Web/package*.json ./
RUN npm install
COPY EducaNet.Web/ ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY EducaNet.Web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
