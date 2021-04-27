import * as Minio from "minio";
import { log } from '../helpers/logging';

const cloud = cloudInstance();

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
                port: parseInt(process.env.MINIO_PORT!) || 9000,
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
            'Content-type': mimeType
          }
        try {
            await cloud.putObject('testing', renamedFile, file.buffer, metadata);
        } catch(err) {
            log.error(err);
        }
        filePaths = [...filePaths, renamedFile];
    }
    return filePaths;
}

export async function getPresignedFilesUrl(files: string[], validityTimeInSeconds: number = 60 * 60): Promise<string[]> {
    let urls: string[] = [];
    if(!files) {
        return [];
    }
    for(const file of files) {
        const getPresignedUrl = await cloud.presignedUrl('GET', 'testing', file, validityTimeInSeconds);
        urls = [...urls, getPresignedUrl];
    }
    return urls;
}

function renameFile(authorisedUser: number, originalName: string): string {
    const timeInMilliseconds = new Date().getTime();
    return timeInMilliseconds +'_' + authorisedUser +'_' + originalName
}
