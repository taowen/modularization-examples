import { Cloud } from '@stableinf/cloud';
import * as esbuild from 'esbuild';
import { esbuildPlugin } from './buildModel';
import { dumpServerlessFunctions } from './dumpServerlessFunctions';
import { Project } from './Project';

let result: esbuild.BuildIncremental;

export async function deployBackend(cloud: Cloud, project: Project) {
    await dumpServerlessFunctions(project);
    if (result) {
        result = await result.rebuild();
    } else {
        result = await (esbuild.build({
            sourcemap: false,
            keepNames: true,
            bundle: true,
            entryPoints: ['serverlessFunctions.js'],
            format: 'cjs',
            outdir: '/tmp',
            write: false,
            absWorkingDir: project.projectDir,
            plugins: [esbuildPlugin(project)],
            incremental: true,
        }) as Promise<esbuild.BuildIncremental>);
    }
    if (await dumpServerlessFunctions(project)) {
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
