import { Load } from "./interfaces";

export default class Bundler {
    private bundleableLocations: Array<string[]> = [];
    private loads: Load[] = [];

    public setBundleableLocations(locationBundles: Array<string[]>) {
        this.bundleableLocations = locationBundles;
        return this;
    }

    public setLoads(loads: Load[]) {
        this.loads = loads;

        return this;
    }

    private sortLoadsByDestinationAndLoadTime() {
        this.loads.sort((loadA, loadB) => {
            if (loadA.destination !== loadB.destination) {
                return loadA.destination > loadB.destination ? -1 : 1;
            }

            const loadStartA = new Date(loadA.loading_window.start);
            const loadStartB = new Date(loadB.loading_window.start);

            return loadStartA.getTime() < loadStartB.getTime() ? -1 : 1;
        });
    }

    public bundle(minimumMinutesBetweenTwoLocations = 60) {
        this.sortLoadsByDestinationAndLoadTime();

        let loadsToBundle = JSON.parse(JSON.stringify(this.loads)) as (Load | null)[];

        const bundles: Array<Load[]> = [];

        const hasTimeConflictWithExistingLoad = (loadToAdd: Load, existingLoads: Load[]) => {
            const loadToAddLoadingStart = new Date(loadToAdd.loading_window.start);
            loadToAddLoadingStart.setMinutes(loadToAddLoadingStart.getMinutes() - minimumMinutesBetweenTwoLocations);

            const loadToAddLoadingEnd = new Date(loadToAdd.loading_window.end);
            loadToAddLoadingEnd.setMinutes(loadToAddLoadingEnd.getMinutes() + minimumMinutesBetweenTwoLocations);

            const loadToAddUnloadingStart = new Date(loadToAdd.unloading_window.start);
            loadToAddUnloadingStart.setMinutes(loadToAddUnloadingStart.getMinutes() - minimumMinutesBetweenTwoLocations);

            const loadToAddUnloadingEnd = new Date(loadToAdd.unloading_window.end);
            loadToAddUnloadingEnd.setMinutes(loadToAddUnloadingEnd.getMinutes() + minimumMinutesBetweenTwoLocations);

            return existingLoads.some(existingLoad => {
                const existingLoadingStart = new Date(existingLoad.loading_window.start);
                const existingUnloadingEnd = new Date(existingLoad.unloading_window.end);

                const loadIsInsideExisting = (
                    loadToAddLoadingStart.getTime() > existingLoadingStart.getTime() &&
                    loadToAddLoadingStart.getTime() < existingUnloadingEnd.getTime()
                ) || (
                    loadToAddLoadingEnd.getTime() > existingLoadingStart.getTime() &&
                    loadToAddLoadingEnd.getTime() < existingUnloadingEnd.getTime()
                ) || (
                    loadToAddUnloadingStart.getTime() > existingLoadingStart.getTime() &&
                    loadToAddUnloadingStart.getTime() < existingUnloadingEnd.getTime()
                ) || (
                    loadToAddUnloadingEnd.getTime() > existingLoadingStart.getTime() &&
                    loadToAddUnloadingEnd.getTime() < existingUnloadingEnd.getTime()
                );
                if (loadIsInsideExisting) {
                    return true;
                }

                const existingUnloadingStart = new Date(existingLoad.unloading_window.start);

                const existingIsBefore = existingUnloadingStart.getTime() < loadToAddLoadingStart.getTime();
                const firstUnloadEnd = existingIsBefore ? existingUnloadingEnd : loadToAddUnloadingEnd;
                const secondLoadStart = existingIsBefore ? loadToAddLoadingStart : existingLoadingStart;

                if (firstUnloadEnd.getTime() > secondLoadStart.getTime()) {
                    return true;
                }

                return false;
            });
        };

        let firstLoadInBundle = loadsToBundle.shift();
        while(firstLoadInBundle) {
            const bundle = [firstLoadInBundle];
            const availableDestinationsForThisBundle = this.bundleableLocations.find((locationBundle) => locationBundle.includes(firstLoadInBundle.destination)) || [firstLoadInBundle.destination];
        
            for(let loadIndex = 0; loadIndex < loadsToBundle.length; loadIndex++) {
                const additionalLoadInBundle = loadsToBundle[loadIndex];

                if (additionalLoadInBundle === null) {
                    continue;
                }

                if (!availableDestinationsForThisBundle.includes(additionalLoadInBundle.destination)) {
                    continue;
                }

                if (hasTimeConflictWithExistingLoad(additionalLoadInBundle, bundle)) {
                    continue;
                }

                bundle.push(additionalLoadInBundle);
                loadsToBundle[loadIndex] = null;
            }

            bundles.push(bundle);

            firstLoadInBundle = loadsToBundle.shift();
            while(firstLoadInBundle === null) {
                firstLoadInBundle = loadsToBundle.shift();
            }
        }

        return bundles;
    }
}