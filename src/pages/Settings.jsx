import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../firebase.js";
import axios from "axios";
import { loginSuccess } from "../redux/userSlice.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 126px);
  color: ${({ theme }) => theme.text};
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;
const Title = styled.h1`
  font-size: 24px;
`;
const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 5px;
`;
const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const Settings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userInfo, setUserInfo] = useState({
    name: currentUser.name,
    email: currentUser.email,
    imgUrl: currentUser.img,
  });
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);

  const handleChange = (e) => {
    setUserInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  // upload new user image and delete the previous image from firebase if exists.
  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImgPerc(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
          setUserInfo((prev) => {
            return { ...prev, imgUrl: downloadUrl };
          });
          // Update user's imgUrl in db
          const updatedUser = await axios.put(
            `users/${currentUser._id}`,
            {imgUrl: downloadUrl}
          );
          dispatch(loginSuccess(updatedUser.data));
        });
        // If user already had image in firebase, delete it.
        if (currentUser.img) {
          const imageRef = ref(storage, currentUser.img);
          deleteObject(imageRef)
            .then(() => {
              console.log("Previous image deleted successfully");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    );
  };

  useEffect(() => {
    img && uploadFile(img);
  }, [img]);

  const handleUpdate = async () => {
    if (!userInfo.name || !userInfo.email) {
      console.log("name and email must have values.");
      return;
    }
    const updatedUser = await axios.put(`users/${currentUser._id}`, userInfo);
    dispatch(loginSuccess(updatedUser.data));
    // navigate('/Settings')
  };

  return (
    <Container>
      <Wrapper>
        <Title>Settings</Title>
        <SubTitle>Username:</SubTitle>
        <Input
          placeholder="Username"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
        />
        <SubTitle>Email:</SubTitle>
        <Input
          placeholder="Email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
        />
        <SubTitle>
          Image: {imgPerc > 0 && "Uploading: " + imgPerc + "%"}
        </SubTitle>
        <Avatar src={userInfo.imgUrl} />
        {imgPerc === 0 && (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Button onClick={() => handleUpdate()}>Update Info</Button>
      </Wrapper>
    </Container>
  );
};

export default Settings;
