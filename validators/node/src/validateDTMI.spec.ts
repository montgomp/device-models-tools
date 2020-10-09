// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import 'jest';
import fs from 'fs';
import validateDTMI from './validateDTMI';

describe('validateDTMI', () => {
    it(`should fail if file doesn't exist`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        expect(validateDTMI('missingFile')).toBeFalsy();
    });
    it(`should fail if empty file`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('');
        expect(validateDTMI('emptyFile')).toBeFalsy();
    });
    it(`should fail on missing "@id" field`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{"something": "dtmi:com:example:ThermoStat;1"}`);
        expect(validateDTMI('missing-id')).toBeFalsy();
    });
    it('should pass valid DTMI', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{"@id": "dtmi:com:example:ThermoStat;1"}`);
        expect(validateDTMI('thermostat-1')).toBeTruthy();
    });
    it('should fail on invalid DTMI, no semicolon', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{"@id": "dtmi:com:example:ThermoStat-1"}`);
        expect(validateDTMI('missingSemicolon')).toBeFalsy();
    });
    it('should fail on invalid DTMI, missing dtmi:', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{"@id": "com:example:ThermoStat;1"}`);
        expect(validateDTMI('noDTMIPrefix')).toBeFalsy();
    });
    it('should pass valid sub DTMI', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Microsoft Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:test:device:property;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(validateDTMI('thermostat-1')).toBeTruthy();
    });
    it('should fail on invalid sub DTMI, not namespaced', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Microsoft Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:otherScope:property;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(validateDTMI('wrongScope')).toBeFalsy();
    });
    it('should fail on invalid sub DTMI, missing dtmi:', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Microsoft Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "com:test:device:property;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(validateDTMI('noDTMIPrefix')).toBeFalsy();
    });
});
