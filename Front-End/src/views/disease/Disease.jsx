import Layout from "../../components/Layout";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Modal, Box, Button, Alert, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, InputAdornment, Slider, InputLabel, Select, MenuItem, Link, Divider, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { usePredict } from "../../contexts/PredictContext";
import { Biotech, CheckRounded, LineWeight, MonitorHeart, Opacity, QueryStats, Search, TireRepair, Vaccines, WarningRounded, WaterDrop } from "@mui/icons-material";
import { useUser } from "../../contexts/UserContext";
import { options } from "../../constants/options";
import { features } from "../../constants/features";
import { units } from "../../constants/units";
import { diseases } from "../../constants/diseases";

const Disease = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const type = location.pathname.slice(1);
    const { user } = useUser();
    const { Predict } = usePredict();
    const token = localStorage.getItem('token');
    const disease = diseases.find(d => d.name === type).display;
    const [inference, setInference] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [predicted, setPredicted] = useState(false);
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if(!diseases.map(disease => disease.name).includes(type)) navigate('/404');
    }, []);

    const bmi = (weight, height) => {
        return weight / (height * height);
    }

    const calculateAge = (birth_date) => {
        const today = new Date();

        return Math.floor((today - new Date(birth_date)) / (1000 * 60 * 60 * 24 * 365));
    }

    const predict = async(e) => {
        e.stopPropagation();
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        setSubmit(true);
        setLoading(true);
        
        let values;

        if(type === 'stroke') {
            values = {
                gender: user.data.gender,
                age: calculateAge(user.data.birth_date),
                hypertension: data.hypertension,
                heart_disease: data.heart_disease,
                ever_married: user.data.ever_married,
                work_type: user.data.work_type,
                residence_type: user.data.residence_type,
                average_glucose_level: data.average_glucose_level,
                bmi: bmi(user.data.weight, user.data.height / 100),
                smoking_status: data.smoking_status
            }
        } else if(type === 'heartattack') {
            values = {
                gender: user.data.gender,
                chest_pain_type: data.chest_pain_type,
                resting_electrocardiographic_result: data.resting_electrocardiographic_result,
                maximum_heart_rate_achieved: data.maximum_heart_rate_achieved,
                exercise_induced_angina: data.exercise_induced_angina,
                previous_peak: data.previous_peak,
                slope: data.slope,
                major_coronary_arteries_number: data.major_coronary_arteries_number,
                thalium_stress_test_result: data.thalium_stress_test_result
            }
        } else if(type === 'heartdiseases') {
            const age = calculateAge(user.data.birth_date);
            let age_category;

            if (age >= 18 && age < 25) {
                age_category = 0
            } else if (age >= 25 && age < 30) {
                age_category = 1
            } else if (age >= 30 && age < 35) {
                age_category = 2
            } else if (age >= 35 && age < 40) {
                age_category = 3
            } else if (age >= 40 && age < 45) {
                age_category = 4
            } else if (age >= 45 && age < 50) {
                age_category = 5
            } else if (age >= 50 && age < 55) {
                age_category = 6
            } else if (age >= 55 && age < 60) {
                age_category = 7
            } else if (age >= 60 && age < 65) {
                age_category = 8
            } else if (age >= 65 && age < 70) {
                age_category = 9
            } else if (age >= 70 && age < 75) {
                age_category = 10
            } else if (age >= 75 && age < 80) {
                age_category = 11
            } else {
                age_category = 12
            }

            values = {
                bmi: bmi(user.data.weight, user.data.height / 100),
                smoking: data.smoking,
                drank_alcohol: data.drank_alcohol,
                stroke: data.stroke,
                walking_difficulty: data.walking_difficulty,
                gender: user.data.gender,
                age_category,
                diabetic: data.diabetic,
                physical_activity: data.physical_activity,
                general_health: data.general_health,
                asthma: data.asthma,
                kidney_disease: data.kidney_disease,
                skin_cancer: data.skin_cancer
            }
        } else if(type === 'diabetesmellitus') {
            values = {
                pregnancy_count: user.data.pregnancy_count,
                plasma_glucose_concentration: data.plasma_glucose_concentration,
                diastolic_blood_pressure: data.diastolic_blood_pressure,
                triceps_skin_fold_thickness: data.triceps_skin_fold_thickness,
                two_hour_insulin: data.two_hour_insulin,
                bmi: bmi(user.data.weight, user.data.height / 100),
                diabetes_pedigree_function: data.diabetes_pedigree_function,
                age: calculateAge(user.data.birth_date)
            }
        }

        const response = await Predict(type, { data: Object.values(values) }, token);

        if(response.status) {
            setInference(false)
            setPredicted(true)
            setResult({ ...values, predictionResult: response.result })
        } else {
            toast.error(<Alert severity="error">{response.message}</Alert>, { icon: false });
        }

        setSubmit(false);
        setLoading(false);
    }

    const Predicted = () => {
        const { predictionResult, ...allFeatures } = result;

        return (
            <>
                <Modal
                    open={true}
                    onClose={() => setPredicted(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className='d-flex flex-column justify-content-start align-items-center' sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%',
                        maxHeight: '75%',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        p: 4,
                    }}>
                        {predictionResult === 1 ? <WarningRounded className="icon-prediction w-10 h-10 text-danger" />
                        : <CheckRounded className="icon-prediction w-10 h-10 text-success" />}

                        <h1 className={`mt-1 mb-1 text-${predictionResult === 1 ? 'danger' : 'success'}`}>{predictionResult === 1 ? 'Risk' : 'No Risk'}</h1>
                        <p className='sub-result mb-4'>{predictionResult === 0 && 'No'} Potential {disease} Risk Identified</p>

                        <Link target='_blank' className="mb-5" underline='hover' href={predictionResult === 1 ? `https://www.google.com/search?q=What+are+${disease}+symptoms%3F` : `https://www.google.com/search?q=How+do+I+prevent+${disease}%3F`}>
                            <Search className="me-1" />
                            {predictionResult === 1 ? `What are ${disease} symptoms?` : `How do I prevent ${disease}?`}
                        </Link>

                        <Divider flexItem variant='middle' className='divider mb-4' />

                        <h4 className='mb-3'>Data</h4>
                        <Box className='d-flex justify-content-center align-items-center'>
                            <div className="me-5">
                                {
                                    Object.keys(allFeatures).map((key) => (
                                        <p className="mb-2">{features[key]}</p>
                                    ))
                                }
                            </div>
                            <div>
                                {
                                    Object.entries(allFeatures).map(([key, value]) => (
                                        options[key] ? <p className="mb-2">{options[key].find(option => option.value === Number(value)).label}</p>
                                        : <p className="mb-2">{value}{units[key] ? ` ${units[key]}` : ''}</p>
                                    ))
                                }
                            </div>
                        </Box>
                    </Box>
                </Modal>

                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </>
        );
    }

    const PredictForm = () => {
        return (
            <>
                <Modal
                    open={true}
                    onClose={() => setInference(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={`${loading && 'd-flex flex-column justify-content-center align-items-center'}`} sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        maxHeight: '75%',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        p: 4,
                    }}>
                        {
                            loading ? <CircularProgress />
                            : <>
                                <h2 className={`mb-${type === 'diabetesmellitus' ? '2' : '5'}`}>Predict {disease} Risk</h2>

                                {type === 'diabetesmellitus' && <p className="warn mb-5 text-muted">This model's accuracy might be lower for males as it was trained mainly on data from female patients.</p>}
        
                                <form onSubmit={(e) => predict(e)} className='d-flex flex-column'>
                                    {
                                        type === 'stroke' && (
                                            <>
                                                <FormLabel id="hypertension">Do you have hypertension?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Hypertension"
                                                    required
                                                    row
                                                    name="hypertension"
                                                    aria-labelledby="hypertension"
                                                >
                                                    {
                                                        options.hypertension.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <FormLabel id="heart_disease">Do you have any heart diseases?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Heart Disease"
                                                    required
                                                    row
                                                    name="heart_disease"
                                                    aria-labelledby="heart_disease"
                                                >
                                                    {
                                                        options.heart_disease.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <TextField
                                                    className='mb-4'
                                                    name='average_glucose_level'
                                                    label="Average Glucose Level"
                                                    placeholder='Enter your average glucose level'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <Opacity />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">mg/dL</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
        
                                                <InputLabel className='mb-1'>Smoking Status</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-4'
                                                    name='smoking_status'
                                                    label="Smoking Status"
                                                    placeholder="Select your smoking status"
                                                >
                                                    {
                                                        options.smoking_status.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </>
                                        )
                                    }
        
                                    {
                                        type === 'heartattack' && (
                                            <>
                                                <InputLabel className='mb-1'>Chest Pain Type</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-4'
                                                    name='chest_pain_type'
                                                    label="Chest Pain Type"
                                                    placeholder="Select your chest pain type"
                                                >
                                                    {
                                                        options.chest_pain_type.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
        
                                                <InputLabel className='mb-1'>Resting Electrocardiographic Result</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-4'
                                                    name='resting_electrocardiographic_result'
                                                    label="Resting Electrocardiographic Result"
                                                    placeholder="Select your resting electrocardiographic result"
                                                >
                                                    {
                                                        options.resting_electrocardiographic_result.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
        
                                                <TextField
                                                    className='mb-4'
                                                    name='maximum_heart_rate_achieved'
                                                    label="Maximum Heart Rate Achieved"
                                                    placeholder='Enter your maximum heart rate achieved'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <MonitorHeart />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">BPM</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
        
                                                <FormLabel id="exercise_induced_angina">Have you ever experienced chest pain during physical activity?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Exercise Induced Angina"
                                                    required
                                                    row
                                                    name="exercise_induced_angina"
                                                    aria-labelledby="exercise_induced_angina"
                                                >
                                                    {
                                                        options.exercise_induced_angina.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <TextField
                                                    className='mb-1'
                                                    name='previous_peak'
                                                    label="Previous Peak"
                                                    placeholder='Enter your previous peak'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <QueryStats />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">mV</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
                                                <p className="guide mb-4">*ST depression induced by exercise relative to rest</p>
        
                                                <InputLabel className='mb-1'>Slope</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-1'
                                                    name='slope'
                                                    label="Slope"
                                                    placeholder="Select your slope"
                                                >
                                                    {
                                                        options.slope.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                <p className="guide mb-4">*Slope of the peak exercise ST segment</p>
        
                                                <FormLabel id="major_coronary_arteries_number">Number of Major Vessels</FormLabel>
                                                <Slider
                                                    className='mb-1'
                                                    name='major_coronary_arteries_number'
                                                    valueLabelDisplay="auto"
                                                    required
                                                    marks
                                                    min={0}
                                                    max={4}
                                                />
                                                <p className="guide mb-4">*Colored by flourosopy</p>
        
                                                <InputLabel className='mb-1'>Thalium Stress Test Result</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-4'
                                                    name='thalium_stress_test_result'
                                                    label="Thalium Stress Test Result"
                                                    placeholder="Select your thalium stress test result"
                                                >
                                                    {
                                                        options.thalium_stress_test_result.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </>
                                        )
                                    }
        
                                    {
                                        type === 'heartdiseases' && (
                                            <>
                                                <FormLabel id="smoking">Do you smoke?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Smoking Status"
                                                    required
                                                    row
                                                    name="smoking"
                                                    aria-labelledby="smoking"
                                                >
                                                    {
                                                        options.smoking.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <FormLabel id="drank_alcohol">Have you had at least one drink of alcohol in the past 30 days?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Drank Alcohol"
                                                    required
                                                    row
                                                    name="drank_alcohol"
                                                    aria-labelledby="drank_alcohol"
                                                >
                                                    {
                                                        options.drank_alcohol.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <FormLabel id="stroke">Have you ever had a stroke?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Stroke"
                                                    required
                                                    row
                                                    name="stroke"
                                                    aria-labelledby="stroke"
                                                >
                                                    {
                                                        options.stroke.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <FormLabel id="walking_difficulty">Do you have serious difficulty walking or climbing stairs?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Walking Difficulty"
                                                    required
                                                    row
                                                    name="walking_difficulty"
                                                    aria-labelledby="walking_difficulty"
                                                >
                                                    {
                                                        options.walking_difficulty.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <InputLabel className='mb-1'>Have you ever had a diabetes?</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-4'
                                                    name='diabetic'
                                                    label="Diabetic"
                                                    placeholder="Select your diabetes history"
                                                >
                                                    {
                                                        options.diabetic.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
        
                                                <FormLabel id="physical_activity">During the past month, other than your regular job, did you participate in any physical activities or exercises such as running, calisthenics, golf, gardening, or walking for exercise?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Physical Activity"
                                                    required
                                                    row
                                                    name="physical_activity"
                                                    aria-labelledby="physical_activity"
                                                >
                                                    {
                                                        options.physical_activity.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <InputLabel className='mb-1'>How would you rate your overall health?</InputLabel>
                                                <Select
                                                    required
                                                    className='mb-4'
                                                    name='general_health'
                                                    label="General Health"
                                                    placeholder="Select your rate of your overall health"
                                                >
                                                    {
                                                        options.general_health.map((option) => (
                                                            <MenuItem value={option.value}>{option.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
        
                                                <FormLabel id="asthma">Have you ever had a asthma?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Asthma"
                                                    required
                                                    row
                                                    name="asthma"
                                                    aria-labelledby="asthma"
                                                >
                                                    {
                                                        options.asthma.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <FormLabel id="kidney_disease">Not including kidney stones, bladder infection or incontinence, were you ever told you had kidney disease?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Kidney Disease"
                                                    required
                                                    row
                                                    name="kidney_disease"
                                                    aria-labelledby="kidney_disease"
                                                >
                                                    {
                                                        options.kidney_disease.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
        
                                                <FormLabel id="skin_cancer">Have you ever had a skin cancer that is not melanoma?</FormLabel>
                                                <RadioGroup
                                                    className='mb-4'
                                                    label="Skin Cancer"
                                                    required
                                                    row
                                                    name="skin_cancer"
                                                    aria-labelledby="skin_cancer"
                                                >
                                                    {
                                                        options.skin_cancer.map((option) => (
                                                            <FormControlLabel value={option.value} control={<Radio />} label={`${option.label}`} />
                                                        ))
                                                    }
                                                </RadioGroup>
                                            </>
                                        )
                                    }
        
                                    {
                                        type === 'diabetesmellitus' && (
                                            <>
                                                <TextField
                                                    className="mb-1"
                                                    name='plasma_glucose_concentration'
                                                    label="Plasma Glucose Concentration"
                                                    placeholder='Enter your plasma glucose concentration'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <WaterDrop />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">mg/dL</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
                                                <p className="guide mb-4">*Plasma glucose concentration at 2 hours in an oral glucose tolerance test</p>
        
                                                <TextField
                                                    className='mb-4'
                                                    name='diastolic_blood_pressure'
                                                    label="Diastolic Blood Pressure"
                                                    placeholder='Enter your diastolic blood pressure'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <TireRepair />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">mm/Hg</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
        
                                                <TextField
                                                    className='mb-4'
                                                    name='triceps_skin_fold_thickness'
                                                    label="Triceps Skin Fold Thickness"
                                                    placeholder='Enter your triceps skin fold thickness'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <LineWeight />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
        
                                                <TextField
                                                    className='mb-1'
                                                    name='two_hour_insulin'
                                                    label="Insulin Amount"
                                                    placeholder='Enter your insulin amount'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <Vaccines />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">μU/mL</InputAdornment>,
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
                                                <p className="guide mb-4">*Amount of insulin present in a milliliter of blood serum after two hours</p>
        
                                                <TextField
                                                    className='mb-4'
                                                    name='diabetes_pedigree_function'
                                                    label="Diabetes Pedigree Function"
                                                    placeholder='Enter your diabetes pedigree function'
                                                    type='number'
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <Biotech />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    variant='outlined'
                                                    size='small'
                                                />
                                            </>
                                        )
                                    }
        
                                    <Button type='submit' disabled={submit} variant='contained' className='my-2'>Predict Risk</Button>
                                </form>
                            </>
                        }
                    </Box>
                </Modal>

                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </>
        );
    }

    return (
        <Layout>
            <Box className='mb-5 d-flex justify-content-between align-items-center'>
                <h2>{disease}</h2>
                <Button variant='contained' onClick={() => setInference(true)}>Predict Risk</Button>
            </Box>

            <Box className='d-flex flex-column justify-content-center align-items-center'>
                <img src={`img/${type}.png`} className="img-disease mb-4"></img>

                {
                    type === 'stroke' && (
                        <p>
                            Damage to the brain from interruption of its blood supply.
                            A stroke is a medical emergency.
                            Symptoms of stroke include trouble walking, speaking and understanding, as well as paralysis or numbness of the face, arm or leg.
                            Early treatment with medication like tPA (clot buster) can minimise brain damage. Other treatments focus on limiting complications and preventing additional strokes.
                        </p>
                    )
                }
                {
                    type === 'heartattack' && (
                        <p>
                            A blockage of blood flow to the heart muscle.
                            A heart attack is a medical emergency. A heart attack usually occurs when a blood clot blocks blood flow to the heart. Without blood, tissue loses oxygen and dies.
                            Symptoms include tightness or pain in the chest, neck, back or arms, as well as fatigue, lightheadedness, abnormal heartbeat and anxiety. Women are more likely to have atypical symptoms than men.
                            Treatment ranges from lifestyle changes and cardiac rehabilitation to medication, stents and bypass surgery.
                        </p>
                    )
                }
                {
                    type === 'heartdiseases' && (
                        <div>
                            Heart conditions that include diseased vessels, structural problems and blood clots.<br />
                            The most common types of heart diseases are:
                            <ul>
                                <li>
                                    Coronary artery disease<br />
                                    Damage or disease in the heart's major blood vessels.
                                </li>
                                <li>
                                    High blood pressure<br />
                                    A condition in which the force of the blood against the artery walls is too high.
                                </li>
                                <li>
                                    Cardiac arrest<br />
                                    Sudden, unexpected loss of heart function, breathing and consciousness.
                                </li>
                                <li>
                                    Congestive heart failure<br />
                                    A chronic condition in which the heart doesn't pump blood as well as it should.
                                </li>
                                <li>
                                    Arrhythmia<br />
                                    Improper beating of the heart, whether irregular, too fast or too slow.
                                </li>
                                <li>
                                    Peripheral artery disease<br />
                                    A circulatory condition in which narrowed blood vessels reduce blood flow to the limbs.
                                </li>
                                <li>
                                    Stroke<br />
                                    Damage to the brain from interruption of its blood supply.
                                </li>
                            </ul>
                        </div>
                    )
                }
                {
                    type === 'diabetesmellitus' && (
                        <div>
                            A group of diseases that result in too much sugar in the blood (high blood glucose).<br />
                            The most common types of diabetes mellitus are:
                            <ul>
                                <li>
                                    Type 2 diabetes<br />
                                    A chronic condition that affects the way the body processes blood sugar (glucose).
                                </li>
                                <li>
                                    Type 1 diabetes<br />
                                    A chronic condition in which the pancreas produces little or no insulin.
                                </li>
                                <li>
                                    Prediabetes<br />
                                    A condition in which blood sugar is high, but not high enough to be type 2 diabetes.
                                </li>
                                <li>
                                    Gestational diabetes<br />
                                    A form of high blood sugar affecting pregnant women.
                                </li>
                            </ul>
                        </div>
                    )
                }
            </Box>

            {(inference || loading) && <PredictForm />}
            {predicted && <Predicted />}
        </Layout>
    );
}

export default Disease;