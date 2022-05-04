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

import AlertToast from "../components/AlertToast";

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
      onLoading: () => {
        setPage(1);
      },
      keepPreviousData: true,
      onSuccess: (data) => {
        setClasses(data.data.classrooms);
      },
      onError: (error) => {
        AlertDispatch(AlertShow(error.response.data.error, "danger"));
      },
    }
  );

  useEffect(() => {
    console.log("use effect home")
  }, []);

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
    console.log("home")
    console.log(classes)
  return (
    <div>
      <ToastContainer />
      <h1>Home</h1>
      { data? classes.map((classroom) => (
        <div key={classroom.id}>
          <h1>{classroom.name}</h1>
          <p>{classroom.description}</p>
        </div>
      )) : null}
      <h2 className="text-center">asd</h2>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous Page
      </button>
      <button disabled={isError} onClick={() => setPage(page + 1)}>
        Next Page
      </button>
    </div>
    );
  
  
  
}

export default Home;
