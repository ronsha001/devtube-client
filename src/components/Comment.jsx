import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import DeleteIcon from "@mui/icons-material/Delete";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0;
  &:hover {
    button {
      display: block;
    }
  }
`;
const Avatar = styled.img`
  min-width: 50px;
  max-height: 50px;
  border-radius: 50%;
  background-color: #999;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
position: relative;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  align-items: center;
`;
const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;
const Text = styled.span`
  font-size: 14px;
`;
const Delete = styled.button`
  position: absolute;
  right: -35px;
  top: -5px;
  color: ${({ theme }) => theme.textSoft};
  display: none;
  background-color: transparent;
  cursor: pointer;
  margin: 0;
  border: none;
  transition: .3s ease-out;
  &:hover{
    color: #cc1a00;
    transition: .3s ease-out;
  }
`;

const Comment = ({ comment, currentUser }) => {
  const [channel, setChannel] = useState({});
  const [display, setDisplay] = useState(true)
  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data);
    };
    fetchComment();
  }, [comment.userId]);

  const handleDelete = async () => {
    if (currentUser && currentUser._id === comment.userId) {
      try {
        await axios.delete(`/comments/${comment._id.toString()}`)
        setDisplay(false);
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    display ? <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date>{format(comment.createdAt)}</Date>{" "}
          { currentUser && currentUser._id === comment.userId &&
          <Delete onClick={handleDelete}>
            <DeleteIcon />
          </Delete> }
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </Container>
    : ""
  );
};

export default Comment;
