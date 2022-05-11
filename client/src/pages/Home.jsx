import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../store/Contexts/AuthContext";
import { AlertContext } from "../store/Contexts/AlertContext";
import { AlertShow } from "../store/Actions/AlertAction";

import { CssBaseline, Grid, Box, Button, FormControl, InputLabel, Select, MenuItem, Avatar } from "@mui/material";
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

import CreateIcon from "../assets/img/create.png"


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

  const [searchparams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();

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
      cacheTime: 1000 * 60 * 5, // 5 minutes
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
      async() => await axios.get("http://localhost:8000/api/user/scores"),
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
    // eslint-disable-next-line
  }, []);

  // everytime category is changed, set page to 1 
  useEffect(()=> {
    setSearchParams({
      category: category,
      page: 1,
    });
    setPage(1);
    // eslint-disable-next-line
  }, [category]);

  //everytime page changes, set url
  useEffect(() => {
    setSearchParams({
      category: category,
      page: page,
    });
  // eslint-disable-next-line
  }, [page]);


  //create sticky button
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlStickyButton = () => {
    if (typeof window !== 'undefined') { 
      if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
        setShow(true); 
      } else { // if scroll up show the navbar
        setShow(false);  
      }
      // remember current page location to use in the next move
      setLastScrollY(window.scrollY); 
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlStickyButton);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlStickyButton);
      };
    }
    // eslint-disable-next-line
  }, [lastScrollY]);

  //State Loading while Retrieving Data
  if (isLoading || isLoadingOwnClassroom || isLoadingScore) {
    return <LoadingPage />;
  }

  if(isError || isErrorOwnClassrooom || isErrorScore){
    return <ErrorPage />
  }

  if( isSuccess ){
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      
      {/* show sticky button top right */}
      {userinfo?.role === true && show && (
        <div className="sticky-button">
          <Avatar className="sticky-button-avatar" src={CreateIcon} sx={{
              height: "6rem",
              width: "6rem",
              position: "fixed",
              display: {xs: "none", sm: "flex"},
              top: "0",
              right: "0",
              m:3,
              marginRight: "10rem",
              zIndex: "999",
              color: "secondary.main",
              fontSize: "1.2rem",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              //onhover show text
              "&:hover": {
                cursor: "pointer",
                scale: 1.1,
            }
          }}
            onClick={() => {
              navigate("/classroom/create");
            }} />
        </div>
      )}
      <Container maxWidth="lg" >

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
              <FormControl variant="outlined" color="math" sx={{ m: 1, minWidth: 120, maxHeight:40, }} >
                <InputLabel id="selector-category" sx={{backgroundColor:"white"}} >Category</InputLabel>
                <Select
                  labelId="selector-category"
                  id="selector-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    color: `${category.toLowerCase() === "all" ? "orange" : category.toLowerCase()}`,
                  }}
                >
                  { sections.map((val, index) => (
                    <MenuItem key={index} value={val.value}>
                      {val.title}
                    </MenuItem>
                  )) }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              
            </Grid>
            <Grid
              item
              xs
              sx={{
                flexWrap: "wrap",
                justifyContent: "space-between",
                justifyItems: "center",
                alignContent: "center",
                //column
                alignItems: "center",
                marginTop: "1rem",
                marginBottom: "1rem",
                //make its disapear on ipad display
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
              <FormControl variant="filled" sx={{ m: 1, minWidth: 60, maxHeight:40 }}>
                <InputLabel id="demo-simple-select-filled-label">Page</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                >
                  {/* { Math.ceil(maximumpages) > 0 && Array.from(Array(Math.ceil(maximumpages)), (val, index) => index + 1).map((val, index) => ( */}
                  {[...Array(Math.ceil(maximumpages))].map((_, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          </Grid>
        </main>
      </Container>

      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </>
  );
  }
}
