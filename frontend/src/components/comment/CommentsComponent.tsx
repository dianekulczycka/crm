import React, {FC, useEffect, useState} from "react";
import {IOrder} from "../../interfaces/order/IOrder";
import {IComment} from "../../interfaces/comment/IComment";
import {getAllComments} from "../../api/commentsService";
import CommentFormComponent from "./CommentFormComponent";
import CommentComponent from "./CommentComponent";
import PreloaderComponent from "../PreloaderComponent";
import OrderChangeModalComponent from "../modals/OrderChangeModalComponent";
import {Button} from "react-bootstrap";
import ErrorComponent from "../ErrorComponent";
import {getAccessToken, getUserDataFromToken} from "../../api/utils/tokenUtil";

interface IProps {
    order: IOrder;
    groups: string[];
    refreshOrders: () => void
}

const CommentsComponent: FC<IProps> = ({order, groups, refreshOrders}) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {email: loggedManagerEmail} = getUserDataFromToken(getAccessToken() ?? "");
    const canEdit = order.managerEmail === loggedManagerEmail || order.managerEmail == null;

    useEffect(() => {
        setIsLoaded(false);
        getAllComments(order.id)
            .then((comments) => {
                setComments(comments);
                setIsLoaded(true);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoaded(true);
            });
    }, [order.id]);

    const onCommentAdded = (newComment: IComment) => {
        setComments([...comments, newComment]);
        refreshOrders();
    };

    const onModalOpen = () => {
        setIsModalOpen(true);
    };

    const onModalClose = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            {isLoaded ? (
                <tr>
                    <td colSpan={5}>
                        <p>UTM: {order.utm || "null"}</p>
                        <p>Message: {order.msg || "null"}</p>
                    </td>
                    <td colSpan={9}>
                        {comments.length > 0 && (
                            <ul className="list-group mb-3 m-2">
                                {comments.map((comment, index) => (
                                    <CommentComponent key={index} comment={comment}/>
                                ))}
                            </ul>
                        )}
                        <CommentFormComponent
                            orderId={order.id}
                            onCommentAdded={onCommentAdded}
                            canEdit={canEdit}
                        />
                        <ErrorComponent error={error}/>
                    </td>
                    <td colSpan={1}>
                        <Button className="btn btn-success m-4 p-2" disabled={!canEdit}
                                onClick={onModalOpen}>edit</Button>
                    </td>
                </tr>) : <PreloaderComponent/>
            }

            {isModalOpen && (
                <div>
                    <OrderChangeModalComponent
                        refreshOrders={refreshOrders}
                        groups={groups}
                        order={order}
                        onClose={onModalClose}
                        isOpen={isModalOpen}
                    />
                </div>
            )}
        </>
    );
};

export default CommentsComponent;