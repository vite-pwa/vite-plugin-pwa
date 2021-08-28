The service worker will store all your application assets in a browser cache (or set of caches). Every time you make
changes to your application and rebuild it, the `service worker` will be also rebuild, including in its cache manifest
all new modified assets, which will have their revision changed (all assets that have been modified will have a new
version). Assets that have not been modified will also be included in the service worker manifest cache, but their
revision will not change from the previous version.
