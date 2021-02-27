import * as fs from 'fs';
import * as path from 'path';

const BASE = process.cwd();

type Archetype = 'Gateway' | 'ActiveRecord' | 'Widget';

class Model {
    public qualifiedName: string;
    public srcFiles: string[] = [];
}

const models = new Map<string, Model>();

function main() {
    const project = process.argv[2];
    if (!project) {
        console.error('must specify project to build');
        return;
    }
    const projectPackageJson = require(`${project}/package.json`);
    for (const pkg of Object.keys(projectPackageJson.dependencies)) {
        const packageJsonPath = require.resolve(`${pkg}/package.json`);
        scanPackage(path.dirname(packageJsonPath));
    }
    // build();
}

function build() {
    for (const [qualifiedName, model] of models.entries()) {
        console.log(qualifiedName);
    }
}

function scanPackage(pkgDir: string) {
    const srcDir = path.join(pkgDir, 'src');
    for (const srcFile of walk(srcDir)) {
        const ext = path.extname(srcFile);
        if (!ext) {
            continue;
        }
        const relPath = path.relative(srcDir, srcFile);
        const dotPos = relPath.indexOf('.');
        const qualifiedName = relPath.substr(0, dotPos);
        const model = registerModel(qualifiedName);
        model.srcFiles.push(srcFile);
    }
}

function registerModel(qualifiedName: string) {
    let model = models.get(qualifiedName);
    if (!model) {
        model = new Model();
        model.qualifiedName = qualifiedName;
        models.set(qualifiedName, model);
    }
    return model;
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
        return;
    }
}

main();