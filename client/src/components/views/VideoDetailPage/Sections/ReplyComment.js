import React, {useState, useEffect} from 'react';
import {Comment, Avatar, Button, Input} from 'antd';
import Axios from "axios";
import {useSelector} from "react-redux";
import SingleComment from "./SingleComment";

const {TextArea} = Input;

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;

        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber)
    }, [props.commentLists]);


    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{width:"80%", marginLeft:"40px"}}>
                        <SingleComment videoId={props.videoId} comment={comment}
                                       refreshFunction={props.refreshFunction}/>
                        <ReplyComment videoId={props.videoId}
                                      commentLists={props.commentLists} refreshFunction={props.refreshFunction}
                                      parentCommentId={comment._id}/>
                    </div>
                }
            </React.Fragment>
        ))


    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    return (
        <div>
            {ChildCommentNumber > 0 &&
            <p style={{fontSize: '14px', margin: 0, color: 'gray'}} onClick={onHandleChange}>
                View {ChildCommentNumber} more comment(s)
            </p>
            }

            {OpenReplyComments &&
            renderReplyComment(props.parentCommentId)
            }

        </div>
    )
        ;
}

export default ReplyComment;