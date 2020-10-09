// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import fs from 'fs';

const parseFiles = (fileNames: string[]) => {
    if (!fileNames) {
        console.error('No file name specified');
    }
    return fileNames.reduce(
        (prev: boolean, fileName: string) => {
            return prev && parseFile(fileName);
        },
        true);
};

export const parseFile = (filename: string) => {
    if (!fs.existsSync(filename)) {
        console.error(`File '${filename} not found.`);
        return false;
    }

    return parseJSONString(fs.readFileSync(filename, 'utf-8'), filename);
};

export const parseJSONString = (jsonString: string, filename: string) => {
    const model = JSON.parse(jsonString);
    if (!model) {
        console.error(`File '${filename}' does not contain valid JSON data`);
        return false;
    }
    // when the node dtdl parser is available, use it here
    return true;
};

export default parseFiles;
