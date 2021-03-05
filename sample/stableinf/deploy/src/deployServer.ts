import { Cloud } from '@stableinf/cloud';
import * as esbuild from 'esbuild';

export async function deployServer(cloud: Cloud, projectDir: string) {
    const result = await esbuild.build({
        bundle: true,
        entryPoints: ['server.js'],
        format: 'cjs',
        write: false,
        absWorkingDir: projectDir,
        watch: {
            onRebuild(err, result) {
                if (result) {
                    onServerBuilt(cloud, result);
                }
            },
        },
    });
    await onServerBuilt(cloud, result);
}

async function onServerBuilt(cloud: Cloud, result: esbuild.BuildResult) {
    await cloud.serverless.createSharedLayer(result.outputFiles[0].text);
    await cloud.serverless.createFunction('handleBatchCall');
    await cloud.apiGateway.createRoute({
        path: '/batchCall',
        httpMethod: 'POST',
        functionName: 'handleBatchCall',
    });
}
