import { promises as fs } from 'fs';
import { join } from 'path';
import Bundler from './bundler';
import { Load } from './interfaces';


(async function run() {
   const bundleableDestinations = JSON.parse((await fs.readFile(join(__dirname, '..', 'data', 'bundleable-destinations.json'))).toString()) as Array<string[]>;
   const loads = JSON.parse((await fs.readFile(join(__dirname, '..', 'data', 'partial-loads.json'))).toString()) as Load[];

   const bundler = new Bundler();
   const bundles = bundler
      .setBundleableLocations(bundleableDestinations)
      .setLoads(loads)
      .bundle(60);

   console.log("Trucks:", JSON.stringify(bundles, null, 4));
})();
