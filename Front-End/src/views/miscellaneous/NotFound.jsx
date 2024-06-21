import { Box, Container, Link } from "@mui/material";

const NotFound = () => {
    return (
        <Container className='container d-flex justify-content-center align-items-center'>
            <Box className='d-flex flex-column justify-content-center align-items-center'>
                <h1 className="fourohfour display-1">404</h1>
                <Link href="/home" underline='hover' className="fw-bold">Go back to home</Link>
            </Box>
        </Container>
    );
}

export default NotFound;