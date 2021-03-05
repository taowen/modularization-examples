import { ObjectStorage } from '@stableinf/cloud';
import * as http from 'http';

const memFs = new Map<string, string>();

// 模拟 aws s3 服务
export async function startObjectStorage(): Promise<ObjectStorage> {
    new http.Server((req, resp) => {
        let reqBody = '';
        req.on('data', (chunk) => {
            reqBody += chunk;
        });
        req.on('end', async () => {
            resp.setHeader('Access-Control-Allow-Origin', '*');
            resp.end(memFs.get(req.url!) || '');
        });
    }).listen(8080);
    console.log('object storage started @8080');
    return {
        putObject: async (path, content) => {
            memFs.set(path, content);
        },
    };
}
