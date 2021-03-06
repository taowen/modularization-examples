import { Cloud } from '@stableinf/cloud';
import * as esbuild from 'esbuild';
import { esbuildPlugin } from './buildModel';
import { dumpServerlessFunctions } from './dumpServerlessFunctions';

export async function deployBackend(cloud: Cloud, project: string, projectDir: string) {
    await dumpServerlessFunctions(project, projectDir);
    const result = await esbuild.build({
        sourcemap: false,
        keepNames: true,
        bundle: true,
        entryPoints: ['serverlessFunctions.js'],
        format: 'cjs',
        outdir: '/tmp',
        write: false,
        absWorkingDir: projectDir,
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

    async function onBuilt(result: esbuild.BuildResult) {
        if (await dumpServerlessFunctions(project, projectDir)) {
            // changed, will rebuild again anyway, skip following tasks
            return;
        }
        await cloud.serverless.createSharedLayer(result.outputFiles[0].text);
        await cloud.serverless.createFunction('handleBatchCall');
        await cloud.apiGateway.createRoute({
            path: '/batchCall',
            httpMethod: 'POST',
            functionName: 'handleBatchCall',
        });
    }
}

