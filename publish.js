const { execSync } = require('child_process');
const { readFileSync, writeFileSync, rmdir, rm } = require('fs');
const { join } = require('path');

const package = process.argv[2];
const subfolder = process.argv[3];

if (!package) {
    throw new Error('Cannot publish undefined package');
}

const packageLocation = join(
    __dirname,
    'packages',
    ...(subfolder ? [subfolder, package] : [package])
);

const packageJsonPath = join(packageLocation, 'package.json');
const raw = readFileSync(packageJsonPath, { encoding: 'utf-8' });
const packageJson = JSON.parse(raw);
packageJson.main = './dist/index.js';
packageJson.types = './dist/index.d.ts';
packageJson.license = 'MIT';
packageJson.publishConfig = {
    access: 'public',
};
packageJson.author = 'Jonathan Rydholm';

try {
    console.log('BUILDING');
    execSync(`yarn workspace @granular/${package} build`);
    console.log('WRITING PACKAGE_JSON');
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
    console.log('PUBLISHING');
    execSync(`yarn workspace @granular/${package} publish --access public`);
} catch (e) {
    console.log('ERROR', e);
} finally {
    console.log('RESETTING');
    writeFileSync(
        packageJsonPath,
        JSON.stringify(JSON.parse(raw), null, 4) + '\n'
    );
    rm(
        join(packageLocation, 'dist'),
        {
            recursive: true,
            force: true,
        },
        () => {}
    );
    rm(
        join(packageLocation, 'tsconfig.tsbuildinfo'),
        { force: true },
        () => {}
    );
}
