docker build -t concord_web_ui .
docker run -p 3000:80 -d concord_web_ui 