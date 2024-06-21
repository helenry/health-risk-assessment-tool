import { Box, TableContainer, Tab, Tabs, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Link, CircularProgress } from "@mui/material";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { diseases } from "../../constants/diseases";
import { usePredict } from "../../contexts/PredictContext";
import { features } from "../../constants/features";
import { options } from "../../constants/options";
import { units } from "../../constants/units";

const PredictionHistory = () => {
    const token = localStorage.getItem('token');
    const [disease, setDisease] = useState(diseases[0].name);
    const { history, GetPredictionHistory } = usePredict();
    const [loading, setLoading] = useState(true);

    const getHistory = async() => {
        if(!history) await GetPredictionHistory(token);
    }

    useEffect(() => {
        getHistory();
    }, []);

    useEffect(() => {
        if(history) setLoading(false);
    }, [history]);

    return (
        <Layout>
            <h2 className='mb-5'>Prediction History</h2>

            <Box>
                <Tabs value={disease} onChange={(e, value) => setDisease(value)} className="mb-3" centered>
                    {
                        diseases.map(d => (
                            <Tab value={d.name} label={d.display} />
                        ))
                    }
                </Tabs>

                <TableContainer component={Paper} className={`d-flex justify-content-${loading ? 'center' : history && history[disease].length ? 'start' : 'center'} align-items-center`}>
                    {
                        loading ? <Box className='d-flex flex-column justify-content-center align-items-center p-5'>
                            <CircularProgress />
                        </Box>
                        : history && history[disease].length ? <Table stickyHeader style={{ width: "auto", tableLayout: "auto" }} sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    {
                                        Object.keys(history[disease][0]).map((key) => (
                                            key !== 'prediction' && <TableCell>{features[key]}</TableCell>
                                        ))
                                    }
                                    <TableCell>Prediction</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {history[disease].map((row, i) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{i + 1}</TableCell>
                                        {
                                            Object.entries(row).map(([feature, data]) => (
                                                (feature !== 'prediction') && (options[feature] ? <TableCell>{options[feature].find(option => option.value === Number(data)).label}</TableCell>
                                                : <TableCell>{data}{units[feature] ? ` ${units[feature]}` : ''}</TableCell>)
                                            ))
                                        }
                                        <TableCell>{row.prediction === 0 ? 'No Risk' : 'Risk'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        : <Box className='d-flex flex-column justify-content-center align-items-center p-5'>
                            <p>You haven't predicted {diseases.find(d => d.name === disease).display} disease yet</p>
                            <Link href={`/${disease}`}><Button variant='contained'>Start Predicting</Button></Link>
                        </Box>
                    }
                </TableContainer>
            </Box>
        </Layout>
    );
}

export default PredictionHistory;