import { Project } from './Project';
import * as path from 'path';
import * as fs from 'fs';
import { listBuiltModels } from './buildModel';

let cache = '';

// watch fs and dump bakcend services into serverlessFunctions.js
export function dumpServerlessFunctions(project: Project) {
    const lines = [
        `require('./backend')`,
        `const { handleCall, handleBatchCall } = require('@stableinf/io');`,
        `SERVERLESS.functions.handleBatchCall = handleBatchCall.bind(undefined, SERVERLESS);`,
    ];
    for (const qualifiedName of listBackendQualifiedNames(project)) {
        lines.push(`require('@motherboard/${qualifiedName}');`);
    }
    const models = listBuiltModels();
    models.sort((a, b) => a.qualifiedName.localeCompare(b.qualifiedName));
    for (const model of models) {
        for (const service of model.services) {
            const className = path.basename(model.qualifiedName);
            const handler = `require('@motherboard/${model.qualifiedName}').${className}.${service}`;
            lines.push(
                `SERVERLESS.functions.${service} = handleCall.bind(undefined, SERVERLESS, ${handler});`,
            );
        }
    }
    const content = lines.join('\n');
    if (content === cache) {
        return false;
    }
    const filePath = path.join(project.projectDir, 'serverlessFunctions.js');
    project.subscribePath(filePath);
    fs.writeFileSync(filePath, (cache = content));
    return true;
}

function listBackendQualifiedNames(project: Project) {
    const qualifiedNames = [];
    for (const pkg of project.packages) {
        project.subscribePath(pkg.path);
        const srcDir = path.join(pkg.path, 'src');
        for (const srcFile of walk(srcDir)) {
            const ext = path.extname(srcFile);
            if (!['.ts', '.js', '.tsx', '.jsx'].includes(ext)) {
                continue;
            }
            const relPath = path.relative(srcDir, srcFile);
            const dotPos = relPath.indexOf('.');
            const qualifiedName = relPath.substr(0, dotPos);
            if (qualifiedName.includes('/Private/') || qualifiedName.includes('/Public/')) {
                qualifiedNames.push(qualifiedName);
            }
        }
    }
    return qualifiedNames;
}

function* walk(filePath: string): Generator<string> {
    try {
        for (const dirent of fs.readdirSync(filePath)) {
            if (dirent.startsWith('.')) {
                continue;
            }
            yield* walk(path.join(filePath, dirent));
        }
    } catch (e) {
        yield filePath;
    }
}
