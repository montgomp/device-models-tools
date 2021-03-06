﻿namespace Azure.IoT.DeviceModelsRepository.Resolver.Fetchers
{
    public class FetchResult
    {
        public string Definition { get; set; }
        public string Path { get; set; }
        public bool FromExpanded
        {
            get { return Path.EndsWith("expanded.json"); }
        }
    }
}