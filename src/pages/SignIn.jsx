import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from "../redux/userSlice";
import { auth, provider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh);
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
const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;
const Links = styled.div`
  margin-left: 40px;
`;
const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/signin", { name, password });
      dispatch(loginSuccess(res.data));

      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date().getTime() + remainingMilliseconds;
      localStorage.setItem("expiryDate", expiryDate);
      setTimeout(() => {
        dispatch(logout());
      }, remainingMilliseconds);

      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/auth/signup", { name, password, email })
      const res = await axios.post("/auth/signin", { name, password });
      dispatch(loginSuccess(res.data));

      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date().getTime() + remainingMilliseconds;
      localStorage.setItem("expiryDate", expiryDate);
      setTimeout(() => {
        dispatch(logout());
      }, remainingMilliseconds);

      navigate("/");
    } catch (err) {
      console.log(err)
    }
  }

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date().getTime() + remainingMilliseconds;
            localStorage.setItem("expiryDate", expiryDate);
            setTimeout(() => {
              dispatch(logout());
            }, remainingMilliseconds);

            navigate("/");
          })
          .catch((err) => {
            throw Error(err)
          });
      })
      .catch((err) => {
        dispatch(loginFailure());
        console.log(err);
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to DevTube</SubTitle>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign In</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Sign In with Google</Button>
        <Title>or</Title>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignUp}>Sign Up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
