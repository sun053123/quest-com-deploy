import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { Container, Typography } from '@mui/material'

function NoPage() {
    const [navigateback, setNavigateback] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setNavigateback(true);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    if (navigateback) {
        return <Navigate to="/" />
    }

    return (
        <Container
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <h1>404</h1>
            <Typography variant="h5" margin={5} sx={{textAlign: 'center'}}>
                Page not found
            </Typography>
        </Container>

    )
}

export default NoPage
