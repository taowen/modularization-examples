import * as memCloud from '@stableinf/cloud-mem';
import { deployFrontend } from './deployFrontend';
import { deployBackend } from './deployBackend';
import { Project } from './Project';
import { Cloud } from '@stableinf/cloud';

export async function watch(projectPackageName: string) {
    const cloud = await memCloud.startCloud();
    const project = new Project(projectPackageName);
    project.startWatcher(deploy.bind(undefined, cloud, project));
}

let deploying: Promise<any>;
let changedFiles: string[] = [];

function deploy(cloud: Cloud, project: Project, changedFile?: string) {
    if (deploying) {
        if (changedFile) {
            changedFiles.push(changedFile);
        }
        return;
    }
    if (changedFile) {
        console.log(`detected ${changedFile} changed, trigger re-deploying...`)
    }
    changedFiles.length = 0;
    const promises = [deployFrontend(cloud, project), deployBackend(cloud, project)];
    deploying = Promise.all(promises);
    deploying.finally(() => {
        deploying = undefined;
        if (changedFiles.length > 0) {
            // some file changed during deploying
            deploy(cloud, project);
        }
    });
    return;
}
