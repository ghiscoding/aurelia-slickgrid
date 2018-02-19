In some cases you might want a feature that is not yet available in `Aurelia-Slickgrid` but exists in the original `SlickGrid`, what should you do? Fear not, we got you covered. `Aurelia-Slickgrid` exposes the `SlickGrid` and `DataView` objects through Event Aggregators, these objects are created when Aurelia-Slickgrid initialize the grid (with `attached()`). So if you subscribe to the Event Aggregator, you will get the SlickGrid and DataView objects and from there you can call any of the SlickGrid features.

### Event Aggregator
Aurelia-Slickgrid (starting with version `1.3.x`) have the following Events that you can subscribe to with an Event Aggregator:
- `onDataviewCreated`
- `onGridCreated`
- `onBeforeGridCreate`
- `onBeforeGridDestroy`
- `onAfterGridDestroyed`

The ones we want to use for our usage would be `onGridCreated` and `onDataviewCreated`, depending on which object you want to obtain. 

### SlickGrid Events (original SlickGrid)
You have access to all original SlickGrid events which you can subscribe, for more info refer to the [Wiki - Grid & DataView Events](/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events)

### Usage
There's already all the necessary information on how to use this on the [Wiki - Grid & DataView Events](/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events#view) page, so I suggest you to head over to that Wiki page on how to use the `SlickGrid` and `DataView` objects