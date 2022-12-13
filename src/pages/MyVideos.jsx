import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../components/Card";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  min-height: calc(100vh - 116px);
`;
const Videos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 70%;
`;
const Editor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;
`;
const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const PopUpContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;
const Confirm = styled.div`
  width: 300px;
  height: 200px;
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`;
const PopUpQuestion = styled.h1`
  margin: 5px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`;

const MyVideos = () => {
  const [popUp, setPopUp] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null)
  const [videos, setVideos] = useState([]);
  const [details, setDetails] = useState({
    title: "",
    desc: "",
    tags: [],
    videoId: "",
  });
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/find/my-videos/${currentUser._id}`);
      setVideos(res.data.videos);
    };
    fetchVideos();
  }, [currentUser._id]);

  const handleChange = (e) => {
    setDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSetPopUp = (e, video) => {
    e.preventDefault()
    setVideoToDelete(video)
    setPopUp(true)
  }

  const handleClear = () => {
    setDetails({
      title: "",
      desc: "",
      tags: [],
      videoId: "",
    });
  };

  const handleSelect = (e, video) => {
    e.preventDefault();
    setDetails({
      title: video.title,
      desc: video.desc,
      tags: video.tags.join(","),
      videoId: video._id,
    });
  };

  const handleEdit = async () => {
    if (
      details.title.length > 0 &&
      details.desc.length > 0 &&
      details.videoId.length > 0
    ) {
      try {
        const updatedVideo = await axios.put(
          `/videos/${details.videoId}`,
          details
        );

        setVideos((prev) => {
          return prev.map((vid) => {
            if (vid._id === details.videoId) {
              vid = { ...updatedVideo.data };
            }
            return vid;
          });
        });

        handleClear();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDelete = async (video) => {
    if (currentUser._id === video.userId) {
      const videoIndex = videos.findIndex((vid) => vid._id === video._id);
      const storage = getStorage();
      // Create a reference to the file to delete
      const videoRef = ref(storage, videos[videoIndex].videoUrl);
      const imageRef = ref(storage, videos[videoIndex].imgUrl);
      // Delete the file
      deleteObject(videoRef)
        .then(() => {
          console.log("Video deleted successfully");
        })
        .catch((error) => {
          console.log(error);
        });
      deleteObject(imageRef)
        .then(() => {
          console.log("Image deleted successfully");
        })
        .catch((error) => {
          console.log(error);
        });
      await axios.delete(`videos/${video._id}`);
      setVideos((prev) => {
        return prev.filter((vid) => vid._id !== video._id);
      });
      setPopUp(false)
    }
  };

  return (
    <Container>
      {popUp && (
        <PopUpContainer>
          <Confirm>
            <PopUpQuestion>
              Are you sure you want to delete this video?
            </PopUpQuestion>
            <ButtonsContainer>
              <Button onClick={() => handleDelete(videoToDelete)}>Yes</Button>
              <Button onClick={() => setPopUp(false)}>Cancel</Button>
            </ButtonsContainer>
          </Confirm>
        </PopUpContainer>
      )}
      <Videos>
        {videos.map((video) => (
          <Card
            key={video._id}
            video={video}
            edit={true}
            handleSelect={handleSelect}
            handleDelete={handleDelete}
            handleSetPopUp={handleSetPopUp}
          />
        ))}
      </Videos>
      <Editor>
        <Input
          type="text"
          value={details.title}
          name="title"
          placeholder="Title"
          onChange={(e) => handleChange(e)}
        />
        <Input
          type="text"
          value={details.desc}
          name="desc"
          placeholder="Description"
          onChange={(e) => handleChange(e)}
        />
        <Input
          type="text"
          value={details.tags}
          name="tags"
          placeholder="Tags"
          onChange={(e) => handleChange(e)}
        />
        <input type="hidden" defaultValue={details.videoId} name="videoId" />
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={handleClear}>Clear</Button>
      </Editor>
    </Container>
  );
};

export default MyVideos;
