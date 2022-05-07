
import { Container, Typography } from '@mui/material'

function ErrorPage() {


    return (
        <Container
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <h1>Oops! :</h1>
            <Typography variant="h5" margin={5} sx={{textAlign: 'center'}}>
                Got an Error :( Try to Fetching Again
            </Typography>
        </Container>

    )
}

export default ErrorPage
