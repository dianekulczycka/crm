import {FC} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {addComment} from "../../services/commentsService";
import {IComment} from "../../interfaces/comment/IComment";
import {Button} from "react-bootstrap";

interface IProps {
    orderId: number;
    onCommentAdded: (comment: IComment) => void;
}

interface CommentForm {
    body: string;
}

const CommentFormComponent: FC<IProps> = ({orderId, onCommentAdded}) => {
    const {register, handleSubmit, reset} = useForm<CommentForm>();

    const onSubmit: SubmitHandler<CommentForm> = async (data) => {
        const newComment = await addComment(orderId, data.body);
        if (newComment) {
            onCommentAdded(newComment);
            reset();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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