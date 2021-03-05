import { Command } from 'commander';

async function deploy(project: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('deploy !!!!', project);
}

const program = new Command().arguments('<project>').action(deploy);
program.parse(process.argv);
