import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { parse } from '@babel/parser';
import * as babel from '@babel/types';
import generate from '@babel/generator';
import { fromObject } from 'convert-source-map';
import { Project } from './Project';

const lstat = promisify(fs.lstat);
const readFile = promisify(fs.readFile);
const cache = new Map<string, Model>();

export interface Model {
    qualifiedName: string;
    code: string;
    hash: number;
    isTsx: boolean;
    resolveDir: string;
    services: string[];
    archetype?: Archetype;
}

interface SrcFile {
    package: string;
    fileName: string;
    content: string;
}

export type Archetype = 'Gateway' | 'ActiveRecord' | 'Widget' | 'Command';

export function esbuildPlugin(project: Project) {
    return {
        name: 'stableinf',
        setup: (build) => {
            build.onResolve({ filter: /^@motherboard\// }, (args) => {
                return { path: args.path, namespace: '@motherboard' };
            });
            build.onLoad({ namespace: '@motherboard', filter: /^@motherboard\// }, async (args) => {
                const model = await buildModel(project, args.path.substr('@motherboard/'.length));
                return {
                    resolveDir: model.resolveDir,
                    contents: model.code,
                    loader: model.isTsx ? 'tsx' : 'ts',
                };
            });
        },
    };
}

export async function buildModel(project: Project, qualifiedName: string) {
    const { hash, srcFiles, resolveDir } = await locateSrcFiles(project.packages, qualifiedName);
    if (srcFiles.size === 0) {
        throw new Error(`referenced ${qualifiedName} not found`);
    }
    let model = cache.get(qualifiedName);
    if (model && model.hash === hash) {
        return model;
    }
    const imports: babel.ImportDeclaration[] = [];
    const others: babel.Statement[] = [];
    const classDecls: babel.ClassDeclaration[] = [];
    const className = path.basename(qualifiedName);
    for (const [srcFilePath, srcFile] of srcFiles.entries()) {
        srcFile.content = (await readFile(srcFilePath)).toString();
        const ast = parse(srcFile.content, {
            plugins: [
                'typescript',
                'jsx',
                'classProperties',
                ['decorators', { decoratorsBeforeExport: true }],
            ],
            sourceType: 'module',
            sourceFilename: srcFilePath,
        });
        extractStatements(className, ast, { imports, others, classDecls });
    }
    const mergedStmts = [...mergeImports(project, qualifiedName, imports), ...others];
    let archetype: Archetype | undefined;
    let services = [];
    if (classDecls.length > 0) {
        if (babel.isIdentifier(classDecls[0].superClass)) {
            archetype = classDecls[0].superClass.name as Archetype;
        }
        const mergedClassDecl = mergeClassDecls(qualifiedName, archetype, classDecls);
        mergedStmts.push(babel.exportNamedDeclaration(mergedClassDecl, []));
        if (archetype === 'ActiveRecord' || archetype === 'Gateway') {
            services = listServices(archetype, mergedClassDecl);
        }
    }
    const merged = babel.file(babel.program(mergedStmts, undefined, 'module'));
    const { code, map } = generate(merged, { sourceMaps: true });
    map.sourcesContent = [];
    let isTsx = false;
    for (const [i, srcFilePath] of map.sources.entries()) {
        if (srcFilePath.endsWith('.tsx')) {
            isTsx = true;
        }
        const srcFile = srcFiles.get(srcFilePath);
        map.sources[i] = `@motherboard/${srcFile.package}/${srcFile.fileName}`;
        map.sourcesContent.push(srcFile.content);
    }
    model = {
        qualifiedName,
        code: `${code}\n${fromObject(map).toComment()}`,
        hash,
        isTsx,
        resolveDir,
        archetype,
        services,
    };
    cache.set(qualifiedName, model);
    return model;
}

export function listBuiltModels() {
    return Array.from(cache.values());
}

function listServices(archetype: Archetype, classDecl: babel.ClassDeclaration) {
    const hasService = archetype === 'Gateway' || archetype === 'ActiveRecord';
    if (!hasService) {
        return [];
    }
    const services = [];
    for (const member of classDecl.body.body) {
        if (
            babel.isClassMethod(member) &&
            babel.isIdentifier(member.key) &&
            member.static &&
            member.accessibility === 'public'
        ) {
            services.push(member.key.name);
        }
        if (
            babel.isClassProperty(member) &&
            babel.isIdentifier(member.key) &&
            member.static &&
            member.accessibility === 'public'
        ) {
            services.push(member.key.name);
        }
    }
    return services;
}

async function locateSrcFiles(packages: { name: string; path: string }[], qualifiedName: string) {
    const srcFiles = new Map<string, SrcFile>();
    let hash = 0;
    let resolveDir = '';
    for (const pkg of packages) {
        for (const ext of ['.ts', '.tsx', '.impl.ts', '.impl.tsx']) {
            const fileName = `${qualifiedName}${ext}`;
            const filePath = path.join(pkg.path, 'src', fileName);
            try {
                const stat = await lstat(filePath);
                hash += stat.mtimeMs;
                srcFiles.set(filePath, { package: pkg.name, fileName, content: '' });
                if (!resolveDir) {
                    resolveDir = pkg.path;
                }
            } catch (e) {
                hash += 1;
            }
        }
    }
    return { hash, srcFiles, resolveDir } as const;
}

function mergeClassDecls(
    qualifiedName: string,
    archetype: Archetype,
    classDecls: babel.ClassDeclaration[],
): babel.ClassDeclaration {
    const methods = new Map<string, babel.ClassMethod>();
    const others = [];
    if (archetype === 'ActiveRecord') {
        const tableName = path.basename(qualifiedName);
        others.push(
            babel.classProperty(
                babel.identifier('tableName'),
                babel.stringLiteral(tableName),
                undefined,
                undefined,
                false,
                true,
            ),
        );
    }
    for (const classDecl of classDecls) {
        for (const member of classDecl.body.body) {
            if (!babel.isClassMethod(member)) {
                others.push(member);
                continue;
            }
            if (babel.isIdentifier(member.key)) {
                const baseMethod = methods.get(member.key.name);
                if (baseMethod) {
                    if (!hasVirtualTag(baseMethod)) {
                        throw new Error(`must use @virtual tsdoc comment to mark a method as interface: ${member.key.name}`);
                    }
                    if (!hasOverrideTag(member)) {
                        throw new Error(`must use @override tsdoc comment to implement virtual method: ${member.key.name}`);
                    }
                }
                methods.set(member.key.name, { ...member, decorators: [] });
            } else {
                others.push(member);
            }
        }
    }
    return {
        ...classDecls[0],
        body: { ...classDecls[0].body, body: [...others, ...methods.values()] },
    };
}

function hasOverrideTag(method: babel.ClassMethod) {
    if (!method.leadingComments) {
        return false;
    }
    for (const comment of method.leadingComments) {
        if (comment.value.includes('@override')) {
            return true;
        }
    }
    return false;
}

function hasVirtualTag(method: babel.ClassMethod) {
    if (!method.leadingComments) {
        return false;
    }
    for (const comment of method.leadingComments) {
        if (comment.value.includes('@virtual')) {
            return true;
        }
    }
    return false;
}

function mergeImports(project: Project, qualifiedName: string, imports: babel.ImportDeclaration[]) {
    const symbols = new Set<string>();
    const merged = [];
    for (const stmt of imports) {
        const isRelativeImport = stmt.source.value[0] === '.';
        if (isRelativeImport) {
            stmt.source.value = `@motherboard/${path.join(
                path.dirname(qualifiedName),
                stmt.source.value,
            )}`;
        } else if (!stmt.source.value.startsWith('@motherboard/')) {
            project.subscribePackage(stmt.source.value);
        }
        const specifiers = [];
        for (const specifier of stmt.specifiers) {
            if (symbols.has(specifier.local.name)) {
                continue;
            }
            symbols.add(specifier.local.name);
            specifiers.push(specifier);
        }
        if (specifiers.length) {
            merged.push({ ...stmt, specifiers });
        }
    }
    return merged;
}

function extractStatements(
    className: string,
    ast: babel.File,
    extractTo: {
        imports: babel.ImportDeclaration[];
        others: babel.Statement[];
        classDecls: babel.ClassDeclaration[];
    },
) {
    for (const stmt of ast.program.body) {
        if (babel.isImportDeclaration(stmt)) {
            extractTo.imports.push(stmt);
        } else if (babel.isExportNamedDeclaration(stmt)) {
            if (
                babel.isClassDeclaration(stmt.declaration) &&
                stmt.declaration.id.name === className
            ) {
                extractTo.classDecls.push(stmt.declaration);
            } else {
                extractTo.others.push(stmt);
            }
        } else {
            extractTo.others.push(stmt);
        }
    }
}
