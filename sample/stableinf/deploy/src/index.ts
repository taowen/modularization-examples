import { Command } from 'commander';
import { buildModel } from './buildModel';
import { Project } from './Project';
import { watch } from './watch';

export async function main() {
    const program = new Command('stableinf');
    program.command('watch <project>').action(watch);
    program
        .command('model <project> <qualifiedName>')
        .action(async (projectPackageName, qualifiedName) => {
            console.log((await buildModel(new Project(projectPackageName), qualifiedName)).code);
        });
    return program.parse(process.argv);
}
