// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import 'jest';
import validateFilePaths from './validateFilePaths';

describe('validateFilePath', () => {
    it('should pass valid filenames', () => {
        expect(validateFilePaths([
            'dtmi/com/example/thermostat-1.json',
            'dtmi/azure/devicemanagement/deviceinformation-1.json'
        ])).toBeTruthy();
    });
    it('should fail on upper case filenames', () => {
        expect(validateFilePaths([
            'dtmi/com/example/Thermostat-1.json',
            'dtmi/azure/devicemanagement/Deviceinformation-1.json'
        ])).toBeFalsy();
    });
    it('should fail on missing version', () => {
        expect(validateFilePaths([
            'dtmi/com/example/thermostat.json',
            'dtmi/azure/devicemanagement/deviceinformation.json'
        ])).toBeFalsy();
    });
    it('should fail on missing dtmi folder', () => {
        expect(validateFilePaths([
            'com/example/thermostat-1.json',
            'azure/devicemanagement/deviceinformation-1.json'
        ])).toBeFalsy();
    });
});
