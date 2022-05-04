//create loading page
import React, { useRef, useEffect } from 'react'

import { Grid } from '@mui/material';

import HashLoader from "react-spinners/HashLoader";
import SyncLoader from "react-spinners/SyncLoader";

import Animatedpage from './Animatedpage';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)



function LoadingPage() {
    //set window to center
    const myRef = useRef(null)
    const executeScroll = () => scrollToRef(myRef)

    useEffect(() => {
        executeScroll()
    }, []);

    return (
        <Animatedpage >
            {/* set window to center */}
            <div
                ref={myRef}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: 'wheat'
                }}>
                <Grid container justifyContent="center">
                    {/* <SyncLoader color="#00BFFF" size={20} margin={2} /> */}
                    <HashLoader size={100} color={"orange"} loading={true} />
                </Grid>
            </div>
        </Animatedpage>
    )
}

export default LoadingPage