import React from "react";
import styled from "styled-components";
import DevTube from "../img/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  min-width: 200px;
  transition: transform 0.3s ease-out;
  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
    transform: ${(props) =>
      props.openMenu ? "translateX(0%)" : "translateX(-100%)"};
    /* display: ${(props) => (props.openMenu ? "block" : "none")}; */
  }
  /* width */
  ::-webkit-scrollbar {
    width: 8px;
    display: none;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #ffffff;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    ::-webkit-scrollbar {
      display: block;
    }
  }
`;
const Wrapper = styled.div`
  padding: 18px 26px;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  margin-bottom: 25px;
`;
const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 13px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({ darkMode, setDarkMode, openMenu }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  return (
    <Container openMenu={openMenu}>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Logo>
            <Img src={DevTube} />
            DevTube
          </Logo>
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <HomeIcon />
            Home
          </Item>
        </Link>
        <Link to="trends" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <ExploreOutlinedIcon />
            Explore
          </Item>
        </Link>
        {currentUser && (
          <>
            <Link
              to="subscriptions"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <SubscriptionsOutlinedIcon />
                Subscriptions
              </Item>
            </Link>
            <Link
              to="my-videos"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <VideoSettingsIcon />
                My Videos
              </Item>
            </Link>
          </>
        )}

        {currentUser && (
          <>
            <Hr />
            <Item>
              <VideoLibraryOutlinedIcon />
              Library
            </Item>
            <Item>
              <HistoryOutlinedIcon />
              History
            </Item>
          </>
        )}
        <Hr />
        {currentUser ? (
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button onClick={() => dispatch(logout())}>
              <LogoutIcon /> {"Logout"}
            </Button>
          </Link>
        ) : (
          <>
            <Login>
              Sign in to like videos, comment, and subscribe.
              <Link to="/sign-in" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlinedIcon /> SIGN IN
                </Button>
              </Link>
            </Login>
            <Hr />
          </>
        )}
        <Title>BEST OF DEVTUBE</Title>
        <Link to="Music" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <LibraryMusicOutlinedIcon />
            Music
          </Item>
        </Link>
        <Link to="Sport" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <SportsBasketballOutlinedIcon />
            Sports
          </Item>
        </Link>
        <Link to="Gaming" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <SportsEsportsOutlinedIcon />
            Gaming
          </Item>
        </Link>
        <Link to="Coding" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <DeveloperModeIcon />
            Coding
          </Item>
        </Link>
        <Link to="Movies" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <MovieOutlinedIcon />
            Movies
          </Item>
        </Link>
        <Link to="News" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <ArticleOutlinedIcon />
            News
          </Item>
        </Link>
        <Link to="Live" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <LiveTvOutlinedIcon />
            Live
          </Item>
        </Link>
        <Hr />
        {currentUser && (
          <Link to="Settings" style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <SettingsOutlinedIcon />
              Settings
            </Item>
          </Link>
        )}
        <Item>
          <FlagOutlinedIcon />
          Report
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          Help
        </Item>
        <Item
          onClick={() => {
            setDarkMode(!darkMode);
            localStorage.setItem("isDarkMode", !darkMode);
          }}
        >
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  );
};

export default Menu;
