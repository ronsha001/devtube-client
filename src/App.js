import { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "./redux/userSlice";
import MyVideos from "./pages/MyVideos";
import Settings from "./pages/Settings";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 22px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  // const [isAuth, setIsAuth] = false;
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode === "false") {
      setDarkMode(false);
    }
    const expiryDate = localStorage.getItem('expiryDate');
    if (expiryDate) {
      setTimeout(() => {
        dispatch(logout())
      }, expiryDate - new Date().getTime() )
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} />
          <Main>
            <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu}/>
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path=":tag" element={<Home /> } />
                  <Route path="subscriptions" element={currentUser ? <Home type="sub" /> : <SignIn /> } />
                  <Route path="my-videos" element={currentUser ? <MyVideos /> : <SignIn />} />
                  <Route path="sign-in" element={currentUser ? <Home type="random" /> : <SignIn />} />
                  <Route path="settings" element={currentUser ? <Settings /> : <SignIn />} />
                  <Route path="search" element={<Search />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
