// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import fs from 'fs';

export const readDTDLFile = (filename: string) => {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    } catch {
        return undefined;
    }
};

export const checkFileExists = (filename: string) => {
    if (!fs.existsSync(filename)) {
        console.error(`File '${filename}' not found.`);
        return false;
    }
    return true;
};
