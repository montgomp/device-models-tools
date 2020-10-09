// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import validateDTMI from './src/validateDTMI';
import validateFilePaths from './src/validateFilePaths';
import parseDTDLFiles from './src/parseDTDLFiles';
import scanForReservedWords from './src/scanForReservedWords';

module.exports = {
    parseDTDLFiles,
    scanForReservedWords,
    validateDTMI,
    validateFilePaths
}