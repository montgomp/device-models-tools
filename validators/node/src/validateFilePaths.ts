// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

const filePathRegex = new RegExp(/^dtmi[\\\/](?:_+[a-z0-9]|[a-z])(?:[a-z0-9_]*[a-z0-9])?(?:[\\\/](?:_+[a-z0-9]|[a-z])(?:[a-z0-9_]*[a-z0-9])?)*-[1-9][0-9]{0,8}\.json$/);

const validateFilePaths = (filenames: string[]) => {
    return filenames.reduce(
        (prev: boolean, filename) => {
            return prev && validateFilePath(filename);
        },
        true);
};

export const validateFilePath = (filename: string) => {
    const result = !!filename.match(filePathRegex);
    if (!result) {
        console.error(`'${filename}' is an invalid format.`);
    }
    return result;
};

export default validateFilePaths;
