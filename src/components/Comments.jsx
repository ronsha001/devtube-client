import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;
const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled.img`
  min-width: 50px;
  max-height: 50px;
  border-radius: 50%;
  background-color: #999;
`;
const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const LeaveComment = styled.button`
  background-color: ${(props) => props.leng > 0 ? '#065fd4' : '#dbdbdb'};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const Comments = ({ videoId }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [videoId]);

  const submitHandler = async () => {
    if (comment.length > 0) {
      const newComment = {
        userId: currentUser._id,
        videoId: videoId,
        desc: comment
      }
      const savedComment = await axios.post('/comments', newComment)
      setComment('')
      setComments([...comments, savedComment.data])
    }
  }

  return (
    <Container>
      {currentUser && (
        <NewComment>
          <Avatar src={currentUser.img} />
          <Input placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
          <LeaveComment onClick={submitHandler} leng={comment.length}>Comment</LeaveComment>
        </NewComment>
      )}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} currentUser={currentUser}/>
      ))}
    </Container>
  );
};

export default Comments;
