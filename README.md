# Node password manager

### .env file structure
```
PORT=port_you_want_the_server_to_run_on
PG_USER=postgres_username
PG_HOST=postgres_host_ip
PG_DATABASE=postgres_database
PG_PASSWORD=postgres_password
PG_PORT=5432
## minio server
# CLOUD_SERVICE = minio or s3
CLOUD_SERVICE=minio
BUCKET_NAME=your_app_bucket
MINIO_ENDPOINT=minio_server_ip
MINIO_PORT=minio_server_port
MINIO_ACCESS_KEY=minio_username
MINIO_SECRET_KEY=minio_password
## s3 server
S3_ENDPOINT=s3_host
S3_PORT=s3_host_port
S3_ACCESS_KEY=s3_username
S3_SECRET_KEY=s3_password
```

### Install
`npm install`

### Start development
`npm run dev`

### Build for production
`npm run build`
