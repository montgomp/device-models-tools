﻿using NUnit.Framework;
using System;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace Azure.IoT.DeviceModelsRepository.Resolver.Tests
{
    class TestHelpers
    {
        readonly static string _fallbackTestRemoteRepo = "https://devicemodeltest.azureedge.net/";

        public static string ParseRootDtmiFromJson(string json)
        {
            var options = new JsonDocumentOptions
            {
                AllowTrailingCommas = true
            };

            using JsonDocument document = JsonDocument.Parse(json, options);
            var dtmi = document.RootElement.EnumerateObject().Single(x => x.Name == "@id").Value.GetString();
            return dtmi;
        }

        public static string GetTestDirectoryPath()
        {
            return Path.GetDirectoryName(Path.GetDirectoryName(Path.GetDirectoryName(TestContext.CurrentContext.TestDirectory)));
        }

        public static string GetTestLocalModelRepository()
        {
            return Path.Combine(GetTestDirectoryPath(), "TestModelRepo");
        }

        public static string GetTestRemoteModelRepository()
        {
            return Environment.GetEnvironmentVariable("PNP_TEST_REMOTE_REPO") ?? _fallbackTestRemoteRepo;
        }
    }
}
