import fs from 'node:fs';
import index from './index.js';

function main() {
    const content = fs.readFileSync(`${import.meta.dirname}/test.md`, 'utf-8');

    const res = index().markup({ content, filename: 'test.md' });

    // write tonew file test_new.md
    fs.writeFileSync(`${import.meta.dirname}/test_new.md`, res.code);

    console.log('done');
}

main()