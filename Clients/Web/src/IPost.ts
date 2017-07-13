import IEntity from "./IEntity";

interface IPost extends IEntity {
    id?: number;
    author: number;
    headline: string;
    headlineImageUrl: string;
    content: string;
    expireDateTime: string;
}

export default IPost;
