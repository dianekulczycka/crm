import React, {FC} from 'react';
import {IComment} from "../../interfaces/comment/IComment";

interface IProps {
    comment: IComment;
}

const CommentComponent: FC<IProps> = ({comment}) => {
    return (
        <li key={comment.id} className="list-group-item">
            {comment.author}: {comment.body} {" "} {comment.createdAt}
        </li>
    );
};

export default CommentComponent;