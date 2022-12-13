import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";

import axios from "axios";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  @media (max-width: 860px) {
    gap: 10px;
    justify-content: center;
  }
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const tag = useLocation().pathname.split("/")[1];

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/${type || tag}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [type, tag]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;
