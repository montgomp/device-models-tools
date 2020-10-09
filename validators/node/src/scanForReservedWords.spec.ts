// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import 'jest';
import fs from 'fs';
import scanForReservedWords from './scanForReservedWords';

describe('scanForReservedWords', () => {
    it(`should fail if file doesn't exist`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        expect(scanForReservedWords('missingFile')).toBeFalsy();
    });
    it(`should fail if empty file`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('');
        expect(scanForReservedWords('emptyFile')).toBeFalsy();
    });
    it(`should fail on missing "@id" field`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{"something": "dtmi:com:example:ThermoStat;1"}`);
        expect(scanForReservedWords('missing-id')).toBeFalsy();
    });
    it(`should pass if root @id contains no reserved words`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:example:device;1",
            "@type": "Interface",
            "displayName": "Azure Device",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('azureRoot')).toBeTruthy();
    });
    it(`should pass if sub @id contains no reserved words`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:example:device;1",
            "@type": "Interface",
            "displayName": "Azure Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:example:device:property;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('azureRoot')).toBeTruthy();
    });
    it(`should fail if root @id contains Azure`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:AzUrE:device;1",
            "@type": "Interface",
            "displayName": "Azure Device",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('azureRoot')).toBeFalsy();
    });
    it(`should fail if sub @id contains Azure`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Azure Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:test:device:Azure;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('azureSub')).toBeFalsy();
    });
    it(`should fail if root @id contains Microsoft`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:MicroSoft:device;1",
            "@type": "Interface",
            "displayName": "Microsoft Device",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('microsoftRoot')).toBeFalsy();
    });
    it(`should fail if sub @id contains Microsoft`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Microsoft Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:test:device:microsoft;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('microsoftSub')).toBeFalsy();
    });
    it(`should fail if root @id contains AzureIoT`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:AzUrEiot:device;1",
            "@type": "Interface",
            "displayName": "Azure IoT Device",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('azureIotRoot')).toBeFalsy();
    });
    it(`should fail if sub @id contains AzureIoT`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Azure Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:test:device:AzureIot;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('azureIoTSub')).toBeFalsy();
    });
    it(`should fail if root @id contains MicrosoftIoT`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:MicrosoftIOT:device;1",
            "@type": "Interface",
            "displayName": "Microsoft IoT Device",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('microsoftIotRoot')).toBeFalsy();
    });
    it(`should fail if sub @id contains MicrosoftIoT`, () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(`{
            "@context": "dtmi:dtdl:context;2",
            "@id": "dtmi:com:test:device;1",
            "@type": "Interface",
            "displayName": "Microsoft IoT Device",
            "contents": [
                {
                    "@type": "Property",
                    "@id": "dtmi:com:test:device:microsoftiot;1",
                    "name": "Failure",
                    "schema": "boolean"
                }
            ]
        }`);
        expect(scanForReservedWords('microsoftIoTSub')).toBeFalsy();
    });
});
