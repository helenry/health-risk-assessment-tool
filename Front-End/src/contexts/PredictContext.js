import { createContext, useContext, useState } from "react";
import axios from "axios";
import { diseases } from "../constants/diseases";

const PredictContext = createContext();

export const PredictProvider = ({ children }) => {
    const [history, setHistory] = useState(null);

    const Predict = async(type, body, token) => {
        const disease = diseases.find(d => d.name === type).display;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}predict/${type}/`, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.status) {
                return { status: true, result: response.data.payload.prediction_result };
            } else {
                return { status: false, message: `${disease} prediction failed.` };
            }
        } catch(e) {
            return { status: false, message: `${disease} prediction error: ${e}.` };
        }
    }

    const GetPredictionHistory = async(token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}predict/history/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.status) {
                const important = { ...response.data.payload.history };
                Object.entries(important).forEach(([disease, predictions]) => {
                    important[disease] = predictions.map((prediction) => {
                        const { crt_at, user_id_id, id, ...importantPrediction } = prediction;
                        return importantPrediction;
                    });
                });
                
                setHistory(important);
                return { status: true, message: `Get all prediction history success.` };
            } else {
                return { status: false, message: `Get all prediction history failed.` };
            }
        } catch(e) {
            return { status: false, message: `Get all prediction history error: ${e}.` };
        }
    }

    return (
        <PredictContext.Provider value={{ history, Predict, GetPredictionHistory }}>
            { children }
        </PredictContext.Provider>
    );
}

export const usePredict = () => useContext(PredictContext);