import { Command } from 'commander';
import * as path from 'path';
import * as esbuild from 'esbuild';
import * as memCloud from '@stableinf/cloud-mem';
import * as fs from 'fs';
import { Cloud } from '@stableinf/cloud';

let cloud: Cloud;

async function deploy(project: string) {
    const packageJsonPath = require.resolve(`${project}/package.json`);
    const projectDir = path.dirname(packageJsonPath);
    const result = await esbuild.build({
        bundle: true,
        entryPoints: ['client.js'],
        write: false,
        absWorkingDir: projectDir,
        define: { 'process.env.NODE_ENV': `"development"` },
        watch: {
            onRebuild(err, result) {
                if (result) {
                    deployClient(projectDir, result);
                }
            },
        },
    });
    await deployClient(projectDir, result);
}

async function deployClient(projectDir: string, buildResult: esbuild.BuildResult) {
    await cloud.objectStorage.putObject('/', fs.readFileSync(path.join(projectDir, 'index.html')).toString());
    await cloud.objectStorage.putObject('/client.js', buildResult.outputFiles[0].text);
}

export async function main() {
    cloud = await memCloud.startCloud();
    const program = new Command().arguments('<project>').action(deploy);
    return program.parse(process.argv);
}
