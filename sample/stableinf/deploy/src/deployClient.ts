import { Cloud } from "@stableinf/cloud";
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path'

export async function deployClient(cloud: Cloud, projectDir: string) {
    const result = await esbuild.build({
        bundle: true,
        entryPoints: ['client.js'],
        write: false,
        absWorkingDir: projectDir,
        define: { 'process.env.NODE_ENV': `"development"` },
        watch: {
            onRebuild(err, result) {
                if (result) {
                    onClientBuilt(cloud, projectDir, result);
                }
            },
        },
    });
    await onClientBuilt(cloud, projectDir, result);
}

async function onClientBuilt(cloud: Cloud, projectDir: string, buildResult: esbuild.BuildResult) {
    await cloud.objectStorage.putObject('/', fs.readFileSync(path.join(projectDir, 'index.html')).toString());
    await cloud.objectStorage.putObject('/client.js', buildResult.outputFiles[0].text);
}