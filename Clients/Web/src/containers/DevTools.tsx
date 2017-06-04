import * as React from "react"
import { createDevTools } from "redux-devtools"
import LogMonitor from "redux-devtools-log-monitor"
import DockMonitor from "redux-devtools-dock-monitor"

const SliderMonitor = require("redux-slider-monitor");

const dm:any = createDevTools(
    <DockMonitor toggleVisibilityKey="alt-h" changePositionKey="alt-w" changeMonitorKey="alt-m" fluid={true} defaultIsVisible={false} defaultSize={0.3}>
        <LogMonitor />
        <SliderMonitor />
    </DockMonitor>
);

export default dm;
