import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

import Header from "../components/Blog/Header";
import MainFeaturedPost from "../components/Blog/MainFeaturedPost";
import FeaturedPost from "../components/Blog/FeaturedPost";
import Main from "../components/Blog/Main";
import Sidebar from "../components/Blog/Sidebar";
import Footer from "../components/Blog/Footer";
import post1 from "../components/Blog/blog-post.1.txt";
import post2 from "../components/Blog/blog-post.1.txt";
import post3 from "../components/Blog/blog-post.1.txt";

import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import { AuthContext } from "../store/Contexts/AuthContext";
import { AlertContext } from "../store/Contexts/AlertContext";
import { AlertShow } from "../store/Actions/AlertAction";

import LoadingPage from "../components/LoadingPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Typography } from "@mui/material";

// import AlertToast from "../components/AlertToast";

const sections = [
  { title: "Science", value: "science" },
  { title: "Math", value: "math" },
  { title: "Society", value: "society" },
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

// const featuredPosts = [
//   {
//     title: "Featured post",
//     date: "Nov 12",
//     description:
//       "This is a wider card with supporting text below as a natural lead-in to additional content.",
//     image: "https://source.unsplash.com/random",
//     imageLabel: "Image Text",
//   },
//   {
//     title: "Post title",
//     date: "Nov 11",
//     description:
//       "This is a wider card with supporting text below as a natural lead-in to additional content.",
//     image: "https://source.unsplash.com/random",
//     imageLabel: "Image Text",
//   },
// ];

const posts = [post1, post2, post3];

const sidebar = {
  title: "About",
  description:
    "Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.",
  archives: [
    { title: "March 2020", url: "#" },
    { title: "February 2020", url: "#" },
    { title: "January 2020", url: "#" },
    { title: "November 1999", url: "#" },
    { title: "October 1999", url: "#" },
    { title: "September 1999", url: "#" },
    { title: "August 1999", url: "#" },
    { title: "July 1999", url: "#" },
    { title: "June 1999", url: "#" },
    { title: "May 1999", url: "#" },
    { title: "April 1999", url: "#" },
  ],
  social: [
    { name: "GitHub", icon: GitHubIcon },
    { name: "Twitter", icon: TwitterIcon },
    { name: "Facebook", icon: FacebookIcon },
  ],
};

export default function Blog() {
  const [category, setCategory] = React.useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [maximumpages, setMaximumPages] = useState(1);
  const [classes, setClasses] = useState([]);
  const [usersocres, setUsersocres] = useState("");
  const [ownclassroom, setOwnclassroom] = useState("");

  const { user, userinfo } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);

  // query from backend by page number (react-query paging)
  const { isLoading, isError } = useQuery(
    ["classrooms", page],
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
      onSuccess: (data) => {
        setClasses(data.data.classrooms);
        setMaximumPages(data.data.maximumitem);
      },
      onError: (error) => {
        AlertDispatch(AlertShow(error.response.data.error));
        //rerender refetch
        //if there is index of paging error , step back
        setPage(page - 1);
        setCategory("all");
      },
    }
  );

  //query score by useQuery
  //   const {
  //     isLoading: isLoadingScore,
  //     isError: isErrorScore,
  //     data: dataScore,
  //     error: errorScore,
  //   } = useQuery(
  //     ["score"],
  //     () => axios.get("http://localhost:8000/api/user/scores"),
  //     {
  //       retry: false,
  //       refetchOnWindowFocus: false,
  //       //retechOnmount is important to avoid empty render when navigating from another page (always true)
  //       refetchOnMount: true,
  //       keepPreviousData: true,
  //       //on guest mode, no need to query scores
  //       enabled: user? true : false,
  //       onSuccess: (data) => {
  //         console.log(data.data.score);
  //         setOwnclassroom(data.data.score);
  //         console.log(usersocres);
  //       },
  //     }
  //   );

  //   const {
  //     isLoading: isLoadingOwnClassroom,
  //     isError: isErrorOwnClassrooom,
  //     data: dataOwnClassroom,
  //     error: errorOwnClassroom,
  //   } = useQuery(
  //     ["ownclassroom"],
  //     () => axios.get("http://localhost:8000/api/user/ownclassroom"),
  //     {
  //       retry: false,
  //       refetchOnWindowFocus: false,
  //       //retechOnmount is important to avoid empty render when navigating from another page (always true)
  //       refetchOnMount: true,
  //       keepPreviousData: true,
  //       //on guest mode, no need to query scores
  //     //   enabled: userinfo?.user.role === true ? true : false,
  //       onSuccess: (data) => {
  //         setOwnclassroom(data.data.ownclassroom);
  //         console.log("ownclassroom :",ownclassroom);
  //       },
  //     }
  //   );

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
  if (isLoading) {
    console.log("loading classrooms data");
    return <LoadingPage />;
  }

  //   if (isLoadingScore) {
  //     console.log("score laoding");
  //     }

  //     if (isErrorScore) {
  //     console.log("score error",errorScore);
  //     }

  //   if (dataScore) {
  //     console.log("score", dataScore);
  //   }
  return (
    <div className="blog-service">
      <CssBaseline />
      <ToastContainer />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} setCategory={setCategory} />
        <main>
          {isError && <div>Error</div>}
          {/* <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous Page
          </button>
          <button disabled={isError} onClick={() => setPage(page + 1)}>
            Next Page
          </button> */}
          <MainFeaturedPost post={mainFeaturedPost} />
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
                  color: "orange",

                  //on mobile device
                  "@media screen and (max-width:40em)": {
                    fontSize: "16px",
                    fontWeight: "regular",
                    color: "orange",
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
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* <Button
                disabled={page === 1}
                variant="contained"
                onClick={() => setPage(page - 1)}
                sx={{
                  outlineStyle: "2px solid #fff",
                  outlineColor: "#fff",
                  outlineOffset: "2px",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#000",
                  // fontSize: "1.2rem",
                  // fontWeight: "bold",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  margin: "0.5rem",
                  width: "fit-content",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "orange",
                    color: "white",
                    outlineColor: "#fff",
                    outlineStyle: "2px solid #fff",
                    outlineOffset: "2px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  },
                  '@media screen and (max-width:40em)': {
                    color: "orange",
                    fontSize: "10px",
                    fontWeight: "regular",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    },
                }}
              >
                Previous Page
              </Button> */}
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous Page
              </Button>

              <Button
                variant="outlined"
                disabled={page === Math.ceil(maximumpages)}
                onClick={() => setPage(page + 1)}
              >
                Next Page
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            {classes.map((classroom) => (
              <FeaturedPost key={classroom._id} classroom={classroom} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="From the firehose" posts={posts} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
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

//    {data
//     ? classes.map((classroom) => (
//         <Card
//           key={classroom._id}
//           sx={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             marginBottom: "2rem",
//             borderRadius: "10px",
//             boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
//             backgroundColor: "white",
//             color: "black",
//             fontSize: "1.2rem",
//             fontWeight: "bold",
//             textAlign: "center",
//             cursor: "pointer",
//             "&:hover": {
//               backgroundColor: "rgba(0, 0, 0, 0.1)",
//             },
//           }}
//         >
//           <h1>{classroom.name}</h1>
//           <p>{classroom.description}</p>
//         </Card>
//       ))
//     : null}
