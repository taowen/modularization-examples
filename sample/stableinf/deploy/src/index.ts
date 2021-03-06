import { Command } from 'commander';
import * as path from 'path';
import * as memCloud from '@stableinf/cloud-mem';
import { deployFrontend } from './deployFrontend';
import { deployBackend } from './deployBackend';
import { buildModel } from './buildModel';

export async function main() {
    const program = new Command('stableinf');
    program.command('dev <project>').action(dev);
    program.command('model <project> <qualifiedName>').action(async (project, qualifiedName) => {
        console.log((await buildModel(project, qualifiedName)).code);
    });
    return program.parse(process.argv);
}

async function dev(project: string) {
    const cloud = await memCloud.startCloud();
    const packageJsonPath = require.resolve(`${project}/package.json`);
    const projectDir = path.dirname(packageJsonPath);
    deployFrontend(cloud, project, projectDir);
    deployBackend(cloud, project, projectDir);
}
