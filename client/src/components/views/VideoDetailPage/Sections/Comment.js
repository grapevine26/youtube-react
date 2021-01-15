import React, {useState, useEffect} from 'react';
import Axios from "axios";
import {useSelector} from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";
import {Input} from "antd";
const {TextArea} = Input;

function Comment(props) {
    const user = useSelector(state => state.user)

    const [CommentValue, setCommentValue] = useState("");
    const [Comments, setComments] = useState([]);

    const handleClick = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            videoId: props.videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then((response) => {
                if (response.data.success) {
                    setCommentValue("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글를 가져오지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {/*comment lists*/}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment videoId={props.videoId} comment={comment}
                                       refreshFunction={props.refreshFunction}/>
                        <ReplyComment videoId={props.videoId} comment={comment}
                                      commentLists={props.commentLists} refreshFunction={props.refreshFunction}
                                      parentCommentId={comment._id}/>
                    </React.Fragment>
                )
            ))}

            {/*root comment form */}
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <TextArea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder="코멘트를 작성해 주세요"
                />

                <br/>
                <button style={{width: "20%", height: "52px"}} onClick={onSubmit}>
                    Submit
                </button>

            </form>
        </div>
    );
}

export default Comment;