import { Cloud } from '@stableinf/cloud';
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import { esbuildPlugin } from './buildModel';

const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);

export async function deployFrontend(cloud: Cloud, project: string, projectDir: string) {
    const result = await esbuild.build({
        sourcemap: 'inline',
        keepNames: true,
        bundle: true,
        entryPoints: ['frontend.js'],
        write: false,
        absWorkingDir: projectDir,
        define: { 'process.env.NODE_ENV': `"development"` },
        plugins: [esbuildPlugin(project)],
        watch: {
            onRebuild(err, result) {
                if (result) {
                    onBuilt(result);
                }
            },
        },
    });
    await onBuilt(result);
    
    async function onBuilt(buildResult: esbuild.BuildResult) {
        const html = await readFileWithCache(path.join(projectDir, 'index.html'));
        await cloud.objectStorage.putObject('/', html);
        await cloud.objectStorage.putObject('/client.js', buildResult.outputFiles[0].text);
    }
}

const fileCache = new Map<string, [number, string]>();

async function readFileWithCache(filePath: string) {
    const mtimeMs = (await lstat(filePath)).mtimeMs;
    if (fileCache.has(filePath)) {
        const [cachedMtimeMs, content] = fileCache.get(filePath);
        if (mtimeMs === cachedMtimeMs) {
            return content;
        }
    }
    const content = (await readFile(filePath)).toString();
    fileCache.set(filePath, [mtimeMs, content]);
    return content;
}
