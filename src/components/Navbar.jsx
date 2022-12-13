import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";
const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 99;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 20px;
  position: relative;
  @media (max-width: 768px) {
    justify-content: space-between;
    padding: 0 20px;
  }
`;
const Search = styled.div`
  width: 40%;
  /* position: absolute;
  left: 0;
  right: 0; */
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.textSoft};
  @media (max-width: 768px) {
    width: 60%;
    padding: 10px;
    margin: 5px 10px;
  }
`;
const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;
const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;
const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;
const Burger = styled.div`
  color: ${({ theme }) => theme.text};
  display: none;
  transform: ${(props) => props.openMenu && "rotate(90deg)"};
  cursor: pointer;
  transition: .3s ease-in;
  @media (max-width: 768px) {
    display: block;
  }

`;
const Navbar = ({ openMenu, setOpenMenu }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Wrapper>
          <Burger openMenu={openMenu} onClick={() => setOpenMenu(!openMenu)}>
            <MenuIcon />
          </Burger>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
            />
            <SearchOutlinedIcon style={{cursor: 'pointer'}} onClick={() => navigate(`/search?q=${q}`)} />
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon style={{cursor: 'pointer'}} onClick={() => setOpen(true)} />
              <Avatar src={currentUser.img} referrerpolicy="no-referrer" />
              {currentUser.name}
            </User>
          ) : (
            <Link to="/sign-in" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon /> SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
