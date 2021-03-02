import * as babel from '@babel/types';
import { parse } from '@babel/parser';
import { transformFromAstSync } from '@babel/core';
import * as fs from 'fs';
import * as path from 'path';

export type Archetype = 'Gateway' | 'ActiveRecord' | 'Widget' | 'Command';
export interface Model {
    archetype: Archetype;
    qualifiedName: string;
    services?: string[];
}

export function buildModel(projectDir: string, qualifiedName: string, srcFiles: string[]): Model {
    const imports: babel.ImportDeclaration[] = [];
    const others: babel.Statement[] = [];
    const classDecls: babel.ClassDeclaration[] = [];
    for (const srcFile of srcFiles) {
        const content = fs.readFileSync(srcFile).toString();
        const ast = parse(content, {
            plugins: [
                'typescript',
                'jsx',
                'classProperties',
                ['decorators', { decoratorsBeforeExport: true }],
            ],
            sourceType: 'module',
            sourceFilename: srcFile,
        });
        extractStatements(ast as babel.File, { imports, others, classDecls });
    }
    const superClass = classDecls[0].superClass;
    if (!babel.isIdentifier(superClass)) {
        throw new Error('archetype not specified');
    }
    const outputPath = getOutputPath(projectDir, qualifiedName);
    const mergedClassDecl = mergeClassDecls(classDecls);
    const merged = babel.file(
        babel.program(
            [
                ...mergeImports(qualifiedName, imports),
                ...others,
                babel.exportNamedDeclaration(mergedClassDecl, []),
            ],
            undefined,
            'module',
        ),
    );
    const result = transformFromAstSync(merged, undefined, {
        filename: outputPath,
        plugins: [
            '@babel/plugin-transform-typescript',
            '@babel/plugin-transform-modules-commonjs',
            '@babel/plugin-transform-react-jsx',
            '@babel/plugin-proposal-class-properties',
        ],
    });
    if (!result || !result.code) {
        throw new Error(`failed to buildModel: ${qualifiedName}`);
    }
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.code);
    const archetype = superClass.name as 'Gateway' | 'ActiveRecord' | 'Widget' | 'Command';
    if (archetype !== 'Gateway' && qualifiedName.includes('/Public/')) {
        throw new Error(`only Gateway can be put in /Public/: ${qualifiedName}`);
    }
    return {
        archetype,
        qualifiedName,
        services: listServices(archetype, mergedClassDecl),
    };
}

function listServices(archetype: Archetype, classDecl: babel.ClassDeclaration) {
    const hasService = archetype === 'Gateway' || archetype === 'ActiveRecord';
    if (!hasService) {
        return undefined;
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

function getOutputPath(projectDir: string, qualifiedName: string) {
    if (qualifiedName.includes('/Ui/')) {
        return path.join(projectDir, 'client', `${qualifiedName}.js`);
    } else {
        return path.join(projectDir, 'server', `${qualifiedName}.js`);
    }
}

function mergeClassDecls(classDecls: babel.ClassDeclaration[]): babel.ClassDeclaration {
    const methods = new Map<string, babel.ClassMethod>();
    const others = [];
    for (const classDecl of classDecls) {
        for (const member of classDecl.body.body) {
            if (babel.isClassMethod(member)) {
                if (babel.isIdentifier(member.key)) {
                    if (methods.has(member.key.name) && !hasOverrideDecorator(member)) {
                        throw new Error(
                            'must decorate method with @override to implement interface',
                        );
                    }
                    methods.set(member.key.name, { ...member, decorators: [] });
                } else {
                    others.push(member);
                }
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

function hasOverrideDecorator(method: babel.ClassMethod) {
    if (!method.decorators) {
        return false;
    }
    for (const decorator of method.decorators) {
        if (babel.isIdentifier(decorator.expression) && decorator.expression.name === 'override') {
            return true;
        }
    }
    return false;
}

function mergeImports(qualifiedName: string, imports: babel.ImportDeclaration[]) {
    const symbols = new Set<string>();
    const merged = [];
    for (const stmt of imports) {
        if (stmt.source.value.startsWith('@motherboard/')) {
            const importFrom = stmt.source.value.substr('@motherboard/'.length);
            stmt.source.value = path.relative(path.dirname(qualifiedName), importFrom);
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
    ast: babel.File,
    extractTo: {
        imports: babel.ImportDeclaration[];
        others: babel.Statement[];
        classDecls: babel.ClassDeclaration[];
    },
) {
    const classDecls = [];
    for (const stmt of ast.program.body) {
        if (babel.isImportDeclaration(stmt)) {
            extractTo.imports.push(stmt);
        } else if (babel.isExportNamedDeclaration(stmt)) {
            if (babel.isClassDeclaration(stmt.declaration)) {
                classDecls.push(stmt.declaration);
            } else {
                extractTo.others.push(stmt);
            }
        } else {
            extractTo.others.push(stmt);
        }
    }
    if (classDecls.length !== 1) {
        throw new Error('must export 1 and only 1 class declaration');
    }
    extractTo.classDecls.push(classDecls[0]);
}
