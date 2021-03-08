import { Cloud } from '@stableinf/cloud';
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import { esbuildPlugin } from './buildModel';
import { Project } from './Project';

const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);

let result: esbuild.BuildIncremental;

export async function deployFrontend(cloud: Cloud, project: Project) {
    if (result) {
        result = await result.rebuild();
    } else {
        result = await (esbuild.build({
            sourcemap: 'inline',
            keepNames: true,
            bundle: true,
            entryPoints: ['frontend.js'],
            write: false,
            platform: 'browser',
            target: 'es2020',
            absWorkingDir: project.projectDir,
            define: { 'process.env.NODE_ENV': `"development"` },
            plugins: [esbuildPlugin(project)],
            incremental: true,
        }) as Promise<esbuild.BuildIncremental>);
    }
    const html = await readFileWithCache(path.join(project.projectDir, 'index.html'));
    await cloud.objectStorage.putObject('/', html);
    await cloud.objectStorage.putObject('/client.js', result.outputFiles[0].text);
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
