import * as path from 'path';

const cache = new Map<string, { name: string; path: string }[]>();

export function listProjectPackages(project: string) {
    let pkgs = cache.get(project);
    if (!pkgs) {
        pkgs = [];
        for (const pkg of Object.keys(require(`${project}/package.json`).dependencies)) {
            pkgs.push({ path: path.dirname(require.resolve(`${pkg}/package.json`)), name: pkg });
        }
        cache.set(project, pkgs);
    }
    return pkgs;
}