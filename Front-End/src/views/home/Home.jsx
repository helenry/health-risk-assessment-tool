import Layout from "../../components/Layout";
import { Box, Link } from "@mui/material";
import { Image } from "react-bootstrap";

const Home = () => {
    return (
        <Layout>
            <Box className='d-flex  justify-content-between align-items-center'>
                <h1 className='mb-5'>Choose Disease<br />to Predict</h1>

                <Box className='position-relative'>
                    <div className="disease position-absolute stroke">
                        <Link underline='none' href='/stroke'>
                            Stroke
                            <div className="line line-stroke"></div>
                        </Link>
                    </div>
                    <div className="disease position-absolute heartdiseases">
                        <Link underline='none' href='/heartdiseases'>
                            Heart Diseases
                            <div className="line line-heartdiseases"></div>
                        </Link>
                    </div>
                    <div className="disease position-absolute heartattack">
                        <Link underline='none' href='/heartattack'>
                            Heart Attack
                            <div className="line line-heartattack"></div>
                        </Link>
                    </div>
                    <div className="disease position-absolute diabetesmellitus">
                        <Link underline='none' href='/diabetesmellitus'>
                            Diabetes Mellitus
                            <div className="line line-diabetesmellitus"></div>
                        </Link>
                    </div>
                </Box>

                <Image src="img/anatomy.jpg" className="anatomy" />
            </Box>
        </Layout>
    );
}

export default Home;