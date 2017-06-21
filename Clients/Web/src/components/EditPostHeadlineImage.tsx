import FileUploadField from "./FileUploadField";
import Image from "./ui/Image";

import React from "react";

export default class EditPostHeadlineImage extends React.Component<IEditPostHeadlineImageProps, {}> {
    public render() {
        if (this.props.imageUrl) {
            return <Image className={this.props.className} src={this.props.imageUrl} cover />;
        }
        return <FileUploadField onFileReady={this.props.onImageUploaded} />;
    }
}

interface IEditPostHeadlineImageProps {
    className?: string;
    imageUrl: string;
    onImageUploaded: any;
}
