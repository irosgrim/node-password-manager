import * as Minio from "minio";
import { log } from '../helpers/logging';
import { renameFile } from '../helpers/text';
const cloud = cloudInstance();
const bucketName = process.env.BUCKET_NAME || '';

function cloudInstance(){
    switch(process.env.CLOUD_SERVICE) {
        case 's3':
            return new Minio.Client({
                endPoint: process.env.S3_ENDPOINT || '',
                accessKey: process.env.S3_ACCESS_KEY || '',
                secretKey: process.env.S3_SECRET_KEY || ''
            })
        default:
        case 'minio':
            return new Minio.Client({
                endPoint: process.env.MINIO_ENDPOINT || '',
                port: process.env.MINIO_PORT && parseInt(process.env.MINIO_PORT!) || 9000,
                useSSL: false,
                accessKey: process.env.MINIO_ACCESS_KEY || '',
                secretKey: process.env.MINIO_SECRET_KEY || ''
            })
    }
}

export async function uploadFiles(authorisedUser: number, files: Express.Multer.File[]) {
    let filePaths: string[] = [];
    for(const file of files) {
        const renamedFile = renameFile(authorisedUser, file.originalname);
        const mimeType = file.mimetype;
        const metadata = {
            'Content-Type': mimeType,
          }
        try {
            await cloud.putObject(bucketName, renamedFile, file.buffer, metadata);
        } catch(error) {
            log.error(error.message);
        }
        filePaths = [...filePaths, renamedFile];
    }
    return filePaths;
}

export async function getPresignedFilesUrl(files: string[], validityTimeInSeconds: number = 60 * 10): Promise<string[]> {
    let urls: string[] = [];
    if(!files) {
        return [];
    }
    for(const file of files) {
        const getPresignedUrl = await cloud.presignedUrl('GET', bucketName, file, validityTimeInSeconds);
        urls = [...urls, getPresignedUrl];
    }
    return urls;
}

export async function deleteFiles(files: string[]): Promise<string[] | void> {
    if(!files || !files.length) {
        return;
    }
    try {
        const r = await cloud.removeObjects(bucketName, files);
        return files;
    } catch (err) {
        log.error(err);
        return;
    }
}