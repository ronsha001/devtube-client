import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Container = styled.div`
  position: relative;
  width: ${(props) => props.type !== "sm" && "300px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "0 11px 45px 0")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;
const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "167px")};
  background-color: #999;
  flex: 1;
  @media (max-width: 768px) {
    max-width: 300px;
  }
`;
const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "8px"};
  padding: ${(props) => props.type !== "sm" && "0 3px"};
  gap: 12px;
  flex: 1;
`;
const ChannelImage = styled.img`
  min-width: 36px;
  max-height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"}; ;
`;
const Texts = styled.div``;
const Title = styled.h1`
  font-size: ${(props) => (props.type === "sm" ? "13px" : "16px")};
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: ${(props) => (props.type === "sm" ? "4px" : "9px 0")};
`;
const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: ${(props) => (props.type === "sm" ? "0" : "24px")};
`;
const Edit = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  color: ${({ theme }) => theme.text};
  transition: 0.3s ease-out;
  &:hover {
    color: #0077cc;
    transition: 0.3s ease-out;
  }
`;
const Delete = styled.div`
  position: absolute;
  top: calc(85% - 24px);
  top: 45px;
  right: 15px;
  color: ${({ theme }) => theme.text};
  transition: .3s ease-out;
  &:hover {
    color: #cc1a00;
  transition: .3s ease-out;
  }
`;

const Card = ({ type, video, edit, handleSelect, handleSetPopUp }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        {edit && (
          <>
            <Edit
              title="Edit this video"
              onClick={(e) => handleSelect(e, video)}
            >
              <VideoSettingsIcon />
            </Edit>
            <Delete
              title="Delete this video"
              onClick={(e) => handleSetPopUp(e, video)}
            >
              <DeleteForeverIcon />
            </Delete>
          </>
        )}
        <Image type={type} src={video.imgUrl} />
        <Details type={type}>
          <ChannelImage type={type} src={channel.img} />
          <Texts>
            <Title type={type}>{video.title}</Title>
            <ChannelName type={type}>{channel.name}</ChannelName>
            <Info type={type}>
              {video.views} views • {format(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
