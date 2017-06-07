import { Dialog } from "material-ui";
import React from "react";

export default class ScrollableDialog extends React.Component<__MaterialUI.DialogProps, {}> {
    public render() {
        return <Dialog
            title="{Title not set}"
            modal={false}
            onRequestClose={this.handleClose}
            {...this.props}
            autoScrollBodyContent={true}
        />;
    }
    private handleClose() {
        return;
    }
}
