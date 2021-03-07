import * as path from 'path';
import * as chokidar from 'chokidar';

export class Project {
    public readonly projectDir: string;
    public readonly packages: { path: string; name: string }[] = [];
    private readonly knownPackageNames = new Set<string>();
    public subscribePath = (filePath: string): void => {}
    
    constructor(private readonly projectPackageName: string) {
        const packageJsonPath = require.resolve(`${this.projectPackageName}/package.json`);
        this.projectDir = path.dirname(packageJsonPath);
        const packageJson = require(`${this.projectPackageName}/package.json`);
        const projectType = packageJson.stableinf?.project || 'solo';
        if (projectType === 'composite') {
            for (const pkg of Object.keys(packageJson.dependencies)) {
                this.packages.push({ path: path.dirname(require.resolve(`${pkg}/package.json`)), name: pkg });
            }
        } else {
            this.packages.push({ path: this.projectDir, name: projectPackageName });
        }
    }

    public startWatcher(onChange: (filePath) => void) {
        const watcher = new chokidar.FSWatcher()
        watcher.on('all', (eventName, filePath) => onChange(filePath));
        this.subscribePath = watcher.add.bind(watcher);
        onChange(undefined);
    }

    public subscribePackage(packageName: string) {
        if (this.knownPackageNames.has(packageName)) {
            return;
        }
        this.knownPackageNames.add(packageName);
        try {
            const dir = path.dirname(require.resolve(`${packageName}/package.json`));
            this.subscribePath(dir);
        } catch(e) {
            // ignore
        }
    }
}
