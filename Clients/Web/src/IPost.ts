import IEntity from "./IEntity";

interface IPost extends IEntity {
    id?: number;
    author: number;
    headline: string;
    headlineImageUrl: string;
    content: string;
    expireDateTime: Date;
}

export default IPost;
