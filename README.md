# Developer Challenge: Load Bundler

## Background

To reduce the CO2 foot print of roadfreigt, it's important to find the optimal route with as little empty capacity as possible.
As a small developer challenge (that will not save the earth but is a great code work-out ;-) ), let's imagine the following situation:

### Goal

We want to develop an algorithm that bundles partial truck loads to as few as possible full truck loads, filling the trucks to 34 palettes (or less - but not much less!).  For our challenge, all the loads are being picked up at a central warehouse, which is the starting point for all trucks.

### Input Data
in the data folder, you will find 2 files:

#### partial-loads.json
This contains random partial truck loads:

```json
  {
     "destination": "Köln",   // Destination
     "pieces": 3,  // Number of euro palettes that need to go to the destination for this load
     "splitable": true,  // if this load can be split into further partials 
     "loading_window": {    // time frame during which the load must be picked up at the central warehouse
        "start": "2021-03-29T21:46:06.074Z",
        "end": "2021-03-29T23:46:06.074Z"
     },
     "unloading_window": {  // time frame during which this load must be dropped off at the destination
        "start": "2021-03-30T21:46:06.074Z",
        "end": "2021-03-30T23:46:06.074Z"
     }
  },
```

#### bundleable-destinations.json
This contains a list of destinations that may be combined.

```json
[
    ["Hamburg","Luebeck","Kiel","Neumuenster","Wedel"],
    ["Bremen","Hannover","Bielefeld"],
    ["Frankfurt", "Köln","Heidelberg"],
    ["Konstanz","Landshut"],
    ["München","Augsburg"]
]
```
This means, for example:  Loads that go to Konstanz are allowed to be combined into 1 truck with loads that go to Landshut, to make it into a multi-stop route.  (Negative example: loads that go to Konstanz may not be combined with Loads that go to Hamburg).

### Sample Output
Feel free to use whatever output format you want.  This here is just an example that would be OK (example for 1 truck, the actual result would be big array of these, one entry for each truck):

```json
   {
      "total_pieces": 31,
      "partials": [
         {
            "destination": "Luebeck",
            "pieces": 26,
            "splitable": true,
            "loading_window": {
               "start": "2021-03-29T22:06:12.974Z",
               "end": "2021-03-30T00:06:12.974Z"
            },
            "unloading_window": {
               "start": "2021-03-30T22:06:12.974Z",
               "end": "2021-03-31T00:06:12.974Z"
            }
         },
         {
            "destination": "Wedel",
            "pieces": 5,
            "splitable": true,
            "loading_window": {
               "start": "2021-03-30T18:03:41.575Z",
               "end": "2021-03-30T20:03:41.575Z"
            },
            "unloading_window": {
               "start": "2021-03-31T18:03:41.575Z",
               "end": "2021-03-31T20:03:41.575Z"
            }
         }
      ],
      "destinations": [
         "Luebeck",
         "Wedel"
      ]
   }
```

## Some Hints

- feel free to start with ignoring the time
- feel free to imageine the time it takes between any drop-off location is 0 (or a standard value you define)
- feel free to start without splitting individual loads

