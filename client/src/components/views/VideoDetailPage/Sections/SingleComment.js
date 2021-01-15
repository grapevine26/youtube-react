import React, {useState} from 'react';
import {Comment, Avatar, Button, Input} from 'antd';
import Axios from "axios";
import {useSelector} from "react-redux";
import LikeDislikes from "./LikeDislikes";

const {TextArea} = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickReply = () => {
        setOpenReply(!OpenReply)
    }
    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if(!CommentValue) {
            alert('댓글을 작성해주세요')
            return;
        }

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            videoId: props.videoId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then((response) => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글를 가져오지 못했습니다.')
                }
            })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
        <span onClick={onClickReply} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt='image'/>}
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply &&
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                        <TextArea
                            style={{width: '100%', borderRadius: '5px'}}
                            onChange={onHandleChange}
                            value={CommentValue}
                            placeholder="코멘트를 작성해 주세요"
                        />
                <br/>
                <button style={{width: "20%", height: "52px"}} onSubmit={onSubmit}>
                    Submit
                </button>
            </form>
            }

        </div>
    )
        ;
}

export default SingleComment;