// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import fs from 'fs';
import { readDTDLFile, checkFileExists } from './utilities';
import jsonata from 'jsonata';

const reservedRegEx = new RegExp(/Microsoft|Azure/i);

const scanForReservedWords = (filename: string) => {
    const model = readDTDLFile(filename);

    if (!model) {
        console.error(`File '${filename}' does not contain valid JSON data`);
        return false;
    }
    const ids: string | string[] = jsonata('**."@id"').evaluate(model);
    if (!ids) {
        console.error(`File '${filename}' does not contain a root '@id' element`);
        return false;
    }

    if (Array.isArray(ids)) {
        const isValid = ids.reduce(
        (valid: boolean, element: string) => {
            const id = element;
            if (id.match(reservedRegEx)) {
                console.error(`File '${filename}' contains a reserved word`);
                return false;
            }
            return valid;
        },
        true);
        return isValid;
    } else {
        if (ids.match(reservedRegEx)) {
            console.error(`File '${filename}' contains a reserved word`);
            return false;
        }
    }
    return true;
};

const validate = (filename: string) => {
    return checkFileExists(filename) && scanForReservedWords(filename);
};

export default validate;
