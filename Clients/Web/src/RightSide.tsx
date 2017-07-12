import React from "react";

export interface IRightSide {
    text: string;
    moreData: any[];
}

export default class RightSide extends React.Component<IRightSide, { expanded: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }
    public render() {
        if (!this.props.text) {
            return <div>Nothing Selected</div>;
        }
        return <div>
            <div>{this.props.text}
                {this.props.moreData &&
                    this.props.moreData.length > 0 &&
                    <button type="button" onClick={() => this.setState({expanded: !this.state.expanded})}>
                        {this.state.expanded ? "-" : "+"}
                    </button>}
                {this.state.expanded && this.props.moreData && this.props.moreData.map((x: any, i) => <RightSide
                    key={i}
                    text={x.provisionName || x.featureName}
                    moreData={x.featureDetails || []} />)}
            </div>
        </div>;
    }
}
