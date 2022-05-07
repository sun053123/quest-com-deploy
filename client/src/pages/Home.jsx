import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import { AuthContext } from "../store/Contexts/AuthContext";
import { AlertContext } from "../store/Contexts/AlertContext";
import { AlertShow } from "../store/Actions/AlertAction";

import { CssBaseline, Grid, Box, Button, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/Home/Header";
import MainFeaturedPost from "../components/Home/MainFeaturedPost";
import FeaturedPost from "../components/Home/FeaturedPost";
import Main from "../components/Home/Main";
import Footer from "../components/Home/Footer";

import post1 from "../components/Home/blog-post.1.txt";
import post2 from "../components/Home/blog-post.1.txt";
import post3 from "../components/Home/blog-post.1.txt";

import ErrorPage from "../components/ErrorPage";
import LoadingPage from "../components/LoadingPage";
import UserScore from "../components/Home/UserScore";
import OwnClassroom from "../components/Home/OwnClassroom";

// const Header = React.lazy(() => import("../components/Home/Header"));
// const MainFeaturedPost = React.lazy(() => import("../components/Home/MainFeaturedPost"));
// const FeaturedPost = React.lazy(() => import("../components/Home/FeaturedPost"));
// const Main = React.lazy(() => import("../components/Home/Main"));
// const Footer = React.lazy(() => import("../components/Home/Footer"));
// const UserScore = React.lazy(() => import("../components/Home/UserScore"));
// const OwnClassroom = React.lazy(() => import("../components/Home/OwnClassroom"));


const sections = [
  { title: "Science", value: "science" },
  { title: "Math", value: "math" },
  { title: "Social", value: "social" },
  { title: "English", value: "english" },
  { title: "Computer", value: "computer" },
  { title: "All", value: "all" },
];

const mainFeaturedPost = {
  title: "Title of a longer featured blog post",
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: "https://source.unsplash.com/random",
  imageText: "main image description",
  linkText: "Continue reading…",
};

const posts = [post1, post2, post3];

export default function Blog() {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [maximumpages, setMaximumPages] = useState(1);
  const [classes, setClasses] = useState([]);
  const [userscores, setUsersocres] = useState([]);
  const [ownclassrooms, setOwnclassrooms] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { userinfo } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);

  // query from backend by page number (react-query paging)
  const {
    isSuccess,
    isLoading,
    isError,
  } = useQuery(
    ["classrooms", page, category],
    () =>
      axios.get("http://localhost:8000/api/classroom", {
        params: { page: page, category: category },
      }),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      keepPreviousData: true,
      // initialData: {
      //   data: {
      //     classrooms: [],
      //     maximumitem: 0,
      //   },
      // },
      //initial data for query (page will not trytofetch from backend)
      enabled: true, //if page is 0, query will not be triggered (page will not try to fetch from backend)
      onSuccess: (data) => {
        setClasses(data.data.classrooms);
        setMaximumPages(data.data.maximumitem);
      },
      onError: (error) => {
        AlertDispatch(AlertShow(error.response.data.error));
        console.log(error);
        //rerender refetch
        //if there is index of paging error , step back
        // setPage(page > 1 ? page - 1 : 1);
        // setCategory("all");
      },
    }
  );

  // query score by useQuery
    const {
      isLoading: isLoadingScore,
      isError: isErrorScore,
    } = useQuery(
      "score",
      () => axios.get("http://localhost:8000/api/user/scores"),
      {
        retry: false,
        refetchOnWindowFocus: false,
        //retechOnmount is important to avoid empty render when navigating from another page (always true)
        refetchOnMount: true,
        //on guest mode, no need to query scores
        enabled: userinfo?.role === false ? true : false,
        onSuccess: (data) => {
          setUsersocres(data.data.scores);
        },
      }
    );

    const {
      isLoading: isLoadingOwnClassroom,
      isError: isErrorOwnClassrooom,
    } = useQuery(
      "ownclassroom",
      () => axios.get("http://localhost:8000/api/user/ownclassroom"),
      {
        retry: false,
        refetchOnWindowFocus: false,
        //retechOnmount is important to avoid empty render when navigating from another page (always true)
        refetchOnMount: true,
        //on guest mode, no need to query scores
        enabled: userinfo?.role === true ? true : false,
        onSuccess: (data) => {
          setOwnclassrooms(data.data.ownclassrooms);
        }
      }
    );

  // initial page params url
  useEffect(() => {
    if (page <= 0) {
      setPage(1);
    }
    setSearchParams({
      category: category,
      page: page,
    });
  }, [page, searchParams, setSearchParams, category]);

    



  //State Loading while Retrieving Data
  if (isLoading || isLoadingOwnClassroom || isLoadingScore) {
    console.log("loading classrooms data");
    return <LoadingPage />;
  }

  if(isError || isErrorOwnClassrooom || isErrorScore){
    return <ErrorPage />
  }

  if( isSuccess ){
  return (
    <div className="blog-service">
      <CssBaseline />
      <ToastContainer />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} setCategory={setCategory} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />

          <Box sx={{ marginTop: "1rem", display: { xs: "none", sm: "block" } }}>
            {userinfo?.role === false && <UserScore userscores={userscores}/> }
            {userinfo?.role === true && <OwnClassroom ownclassrooms={ownclassrooms}/> }
          </Box>

          <Grid
            container
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Grid item xs>
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: `${category.toLowerCase() === "all" ? "orange" : category.toLowerCase()}`,
                  //on mobile device
                  "@media screen and (max-width:40em)": {
                    fontSize: "12px",
                    fontWeight: "regular",
                    color: `${category.toLowerCase() === "all" ? "orange" : category.toLowerCase()}`,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              >
                Category : {category.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  fontWeight: "regular",
                  "@media screen and (max-width:40em)": {
                    fontSize: "16px",
                    fontWeight: "bold",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  },
                }}
              >
                Page : {page}
              </Typography>
            </Grid>
            <Grid
              item
              xs
              sx={{
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
                marginBottom: "1rem",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
               
              >
                Previous Page
              </Button>
              <Button
              variant="outlined"
              disabled={page === Math.ceil(maximumpages) || classes.length ===  0}
              onClick={() => setPage(page + 1)}
              
            >
              Next Page
            </Button>
            </Grid>
            
            <Box sx={{ display: { sm: "none" } }}>
              <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ArrowBackIosIcon
                      variant="contained"
                      disabled={page === 1}
                    />
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    disabled={page === Math.ceil(maximumpages) ||  classes.length ===  0}
                    onClick={() => setPage(page + 1)}
                  >
                    <ArrowForwardIosIcon variant="contained" />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {classes.length > 0 && (
            <Grid container spacing={4}>
              {classes.map((classroom) => (
                <FeaturedPost key={classroom._id} classroom={classroom} />
              ))}
            </Grid>
          )}
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="From the firehose" posts={posts} />
            {/* <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            /> */}
          </Grid>
        </main>
      </Container>

      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </div>
  );
  }
}
