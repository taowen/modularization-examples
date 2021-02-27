import * as childProcess from 'child_process';
import * as fs from 'fs';

export function main() {
    fs.mkdirSync('log', { recursive: true });    
    for (const project of process.argv.slice(2)) {
        const logFile = `log/${project.replace('/', '-')}.server.log`;
        fs.writeFileSync(logFile, '');
        childProcess.exec(`ts-node ./startServer.ts ${project} > ${logFile}`);
    }
    childProcess.execSync('tail -f log/*.log', { stdio: 'inherit' });
}

main();