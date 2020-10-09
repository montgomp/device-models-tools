// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { readDTDLFile, checkFileExists } from './utilities';
import jsonata from 'jsonata';

const dtmiRegex = new RegExp(/^dtmi:(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?)*;[1-9][0-9]{0,8}$/);
const versionRegex = RegExp(/;[1-9][0-9]{0,8}$/);

const validateDTMI = (filename: string) => {
    const model = readDTDLFile(filename);
    if (!model) {
        console.error(`File '${filename}' does not contain valid JSON data`);
        return false;
    }

    const rootId = model['@id'];

    if (!rootId) {
        console.error(`File '${filename}' does not contain a root '@id' element`);
        return false;
    }

    const ids: string | string[] = jsonata('**."@id"').evaluate(model);
    if (Array.isArray(ids)) {
        const isValid = ids.reduce(
        (valid: boolean, element: string) => {
            if (!element.match(dtmiRegex)) {
                console.error(`File '${filename}' contains an invalid DTMI '${element}'`);
                return false;
            }
            if (element !== rootId){
                const namespace = rootId.replace(versionRegex, '');
                if (!element.startsWith(namespace)) {
                    console.error(`File '${filename}' contains an invalid sub DTMI '${element}'. Does not match DTMI at root of document ${rootId}`);
                    return false;
                }
            }
            return valid;
        },
        true);
        return isValid;
    } else {
        if (!ids.match(dtmiRegex)) {
            console.error(`File '${filename}' contains an invalid DTMI '${ids}'`);
            return false;
        }
    }
    return true;
};

const validate = (filename: string) => {
    return checkFileExists(filename) && validateDTMI(filename);
};

export default validate;
