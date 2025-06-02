import React, {FC, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {addComment} from "../../api/commentsService";
import {IComment} from "../../interfaces/comment/IComment";
import {Button} from "react-bootstrap";
import ErrorComponent from "../ErrorComponent";

interface IProps {
    orderId: number;
    onCommentAdded: (comment: IComment) => void;
}

interface ICommentForm {
    body: string;
}

const CommentFormComponent: FC<IProps> = ({orderId, onCommentAdded}) => {
    const [error, setError] = useState<string | null>(null);
    const {register, handleSubmit, reset} = useForm<ICommentForm>();

    const onSubmit: SubmitHandler<ICommentForm> = (data) => {
        addComment(orderId, data.body)
            .then((newComment) => {
                onCommentAdded(newComment);
                reset();
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ErrorComponent error={error} />
            <div className="mb-3 m-2">
        <textarea
            {...register("body", {required: true})}
            className="form-control"
            placeholder="comment"
        />
            </div>
            <Button type="submit" className="btn btn-success float-end">send</Button>
        </form>
    );
};

export default CommentFormComponent;