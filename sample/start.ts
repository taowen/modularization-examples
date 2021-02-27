import * as childProcess from 'child_process';
import * as fs from 'fs';

export function main() {
    fs.mkdirSync('log', { recursive: true });    
    for (const project of process.argv.slice(2)) {
        startServer(project);
        startClient(project);
    }
    childProcess.execSync('tail -f log/*.log', { stdio: 'inherit' });
}

function startServer(project: string) {
    const logFile = `log/${project.replace('/', '-')}.server.log`;
    fs.writeFileSync(logFile, '');
    childProcess.exec(`ts-node ./startServer.ts ${project} > ${logFile}`);
}

function startClient(project: string) {
    const logFile = `log/${project.replace('/', '-')}.client.log`;
    fs.writeFileSync(logFile, '');
    childProcess.exec(`PROJECT=${project} webpack-cli serve --config startClient.js > ${logFile}`);
}

main();