import { Command } from 'commander';
import * as path from 'path';
import * as memCloud from '@stableinf/cloud-mem';
import { Cloud } from '@stableinf/cloud';
import { deployClient } from './deployClient';
import { deployServer } from './deployServer';

async function deploy(cloud: Cloud, project: string) {
    const packageJsonPath = require.resolve(`${project}/package.json`);
    const projectDir = path.dirname(packageJsonPath);
    deployClient(cloud, projectDir);
    deployServer(cloud, projectDir);
}

export async function main() {
    const cloud = await memCloud.startCloud();
    const program = new Command().arguments('<project>').action(deploy.bind(undefined, cloud));
    return program.parse(process.argv);
}
