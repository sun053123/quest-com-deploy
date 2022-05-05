import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import { AuthContext } from "../store/Contexts/AuthContext";
import { AlertContext } from "../store/Contexts/AlertContext";
import { AlertShow } from "../store/Actions/AlertAction";

import LoadingPage from "../components/LoadingPage";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import AlertToast from "../components/AlertToast";
import { Card, Container, Grid } from "@mui/material";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);
  const [classes, setClasses] = useState([]);

  // query from backend by page number (react-query paging)
  const { isLoading, isError, data } = useQuery(
    ["classrooms", page],
    () =>
      axios.get("http://localhost:8000/api/classroom", {
        params: { page: page, category: "all" },
      }),
    {
      retry: false,
      // onLoading: () => {
      //   setPage(1);
      // },
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page
      refetchOnMount: true,
      keepPreviousData: true,
      onSuccess: (data) => {
        setClasses(data.data.classrooms);
      },
      onError: (error) => {
        AlertDispatch(AlertShow(error.response.data.error));
      },
    }
  );

  // initial page params url
  useEffect(() => {
    if (page <= 0) {
      setPage(1);
    }
    setSearchParams({
      category: "all",
      page: page,
    });
  }, [page, searchParams, setSearchParams]);

  //State Loading while Retrieving Data
  if (isLoading) {
    console.log("loading");
    return <LoadingPage />;
  }

  //Render if request success\
    // console.log("home")
    // console.log(classes)
  return (
    <Container >
      <ToastContainer />
      <h1>Home</h1>
  
      { data? classes.map((classroom) => (
        <Card key={classroom._id} sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2rem",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          color: "black",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
        }} >
          
          <h1>{classroom.name}</h1>
          <p>{classroom.description}</p>
        </Card>
      )) : null}
    

      { isError? 
        <h1>Something went wrong!</h1> 
      : null}

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous Page
      </button>
      <button disabled={isError} onClick={() => setPage(page + 1)}>
        Next Page
      </button>
    </Container>
  
    );
  
  
  
}

export default Home;
