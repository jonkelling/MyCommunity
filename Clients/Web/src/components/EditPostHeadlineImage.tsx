import FileUploadField from "./FileUploadField";
import Image from "./ui/Image";

import React from "react";
import { RaisedButton } from "./ui";

export default class EditPostHeadlineImage extends React.Component<IEditPostHeadlineImageProps, {}> {
    public render() {
        if (this.props.imageUrl) {
            return <div>
                <Image
                    className={this.props.className}
                    src={this.props.imageUrl} cover />
                <RaisedButton
                    label="Remove Image"
                    onTouchTap={this.props.onImageRemoved} />
            </div>;

        }
        return <FileUploadField onFileReady={this.props.onImageUploaded} />;
    }
}

interface IEditPostHeadlineImageProps {
    className?: string;
    imageUrl: string;
    onImageUploaded: (filename: string) => any;
    onImageRemoved: () => any;
}
