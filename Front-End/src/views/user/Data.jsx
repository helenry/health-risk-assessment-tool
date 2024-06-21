import dayjs from "dayjs";
import { useState } from "react";
import Layout from "../../components/Layout";
import { Button, Alert, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, InputAdornment, Autocomplete, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "../../contexts/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Height, MonitorWeight, PregnantWoman } from "@mui/icons-material";
import { options } from "../../constants/options";

const Data = () => {
    const navigate = useNavigate();
    const params = useLocation();
    const { user, PostUserData, PatchUserData } = useUser();
    const firstVisit = (params.state !== null && (params.state.first === true || params.state.first === false)) ? params.state.first : user.data ? false : true;
    const token = localStorage.getItem('token');
    const [values, setValues] = useState(user.data ? user.data : {});
    const [submit, setSubmit] = useState(false);
    const [writeMode, setWriteMode] = useState(firstVisit);
    const todaysDate = new Date().toISOString().slice(0, 10);

    const save = async(e) => {
        e.stopPropagation();
        e.preventDefault();
        
        let response;
        setSubmit(true);
        
        let data = { ...values, work_type: values.work_type, birth_date: typeof values.birth_date === 'string' ? values.birth_date : `${values.birth_date.$y}-${values.birth_date.$M + 1}-${values.birth_date.$D}` }
        if(Number(data.gender) === 0) data.pregnancy_count = 0;
        
        if(firstVisit) {
            response = await PostUserData(data, token);
        } else {
            response = await PatchUserData(data, token);
        }

        if(response.status) {
            toast.success(<Alert severity="success">{response.message}</Alert>, { icon: false });
            if(firstVisit) navigate('/home')
        } else {
            toast.error(<Alert severity="error">{response.message}</Alert>, { icon: false });
        }

        setSubmit(false);
        setWriteMode(false)
    }
    
    return (
        <Layout>
            <Box className={`${!firstVisit && 'd-flex justify-content-between align-items-center'} mb-5`}>
                <h2>Personal Data</h2>
                {!firstVisit && <Button onClick={() => setWriteMode(true)} color='secondary' disabled={writeMode} className='my-2 fw-bold'>Update Data</Button>}
            </Box>

            <form onSubmit={(e) => save(e)} className='d-flex flex-column'>
                <DatePicker
                    className='mb-4'
                    defaultValue={Object.keys(values).length !== 0 && values.birth_date ? dayjs(values.birth_date) : dayjs(todaysDate)}
                    label="Birth Date"
                    type='date'
                    required
                    disabled={!writeMode}
                    onChange={(date) => setValues({ ...values, birth_date: date })}
                    variant='outlined'
                    size='small'
                />

                <FormLabel id="gender">Gender</FormLabel>
                <RadioGroup
                    className='mb-4'
                    defaultValue={Object.keys(values).length !== 0 && (values.gender === 0 || values.gender === 1) ? String(values.gender) : null}
                    label="Gender"
                    required
                    disabled={!writeMode}
                    onChange={(e) => setValues({ ...values, gender: e.target.value })}
                    row
                    name="gender"
                    aria-labelledby="gender"
                >
                    {
                        options.gender.map((option) => (
                            <FormControlLabel disabled={!writeMode} value={String(option.value)} control={<Radio />} label={`${option.label}`} />
                        ))
                    }
                </RadioGroup>

                <TextField
                    className='mb-4'
                    value={Object.keys(values).length !== 0 && values.weight ? values.weight : null}
                    label="Weight"
                    placeholder='Enter your weight'
                    type='number'
                    required
                    disabled={!writeMode}
                    onChange={(e) => setValues({ ...values, weight: e.target.value })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <MonitorWeight />
                            </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    variant='outlined'
                    size='small'
                />

                <TextField
                    className='mb-4'
                    value={Object.keys(values).length !== 0 && values.height ? values.height : null}
                    label="Height"
                    placeholder='Enter your height'
                    type='number'
                    required
                    disabled={!writeMode}
                    onChange={(e) => setValues({ ...values, height: e.target.value })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Height />
                            </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                    variant='outlined'
                    size='small'
                />

                <FormLabel id="ever_married">Have you ever married?</FormLabel>
                <RadioGroup
                    className='mb-4'
                    defaultValue={Object.keys(values).length !== 0 && (values.ever_married === 0 || values.ever_married === 1) ? String(values.ever_married) : null}
                    label="Marriage History"
                    required
                    disabled={!writeMode}
                    onChange={(e) => setValues({ ...values, ever_married: e.target.value })}
                    row
                    name="ever_married"
                    aria-labelledby="ever_married"
                >
                    {
                        options.ever_married.map((option) => (
                            <FormControlLabel disabled={!writeMode} value={String(option.value)} control={<Radio />} label={`${option.label}`} />
                        ))
                    }
                </RadioGroup>

                <Autocomplete
                    className='mb-4'
                    isOptionEqualToValue={((option, value) => String(option.value) === (typeof value !== 'string' ? String(value.value) : null))}
                    value={Object.keys(values).length !== 0 && typeof values.work_type === 'number' ? options.work_type.find(option => option.value === values.work_type) : null}
                    getOptionLabel={(option) => option.label}
                    required
                    disabled={!writeMode}
                    onChange={(e, selected) => setValues({ ...values, work_type: selected.value })}
                    variant='outlined'
                    size='small'
                    disablePortal
                    options={options.work_type}
                    renderInput={(params) => <TextField {...params} label="What is your current job?" placeholder="Select your job" />}
                />

                <FormLabel id="residence_type">What type of area do you live in?</FormLabel>
                <RadioGroup
                    className='mb-4'
                    defaultValue={Object.keys(values).length !== 0 && (values.residence_type === 0 || values.residence_type === 1) ? String(values.residence_type) : null}
                    label="Residence Type"
                    required
                    disabled={!writeMode}
                    onChange={(e) => setValues({ ...values, residence_type: e.target.value })}
                    row
                    name="residence_type"
                    aria-labelledby="residence_type"
                >
                    {
                        options.residence_type.map((option) => (
                            <FormControlLabel disabled={!writeMode} value={String(option.value)} control={<Radio />} label={`${option.label}`} />
                        ))
                    }
                </RadioGroup>

                {
                    Number(values.gender) === 1 && <TextField
                        className='mb-4'
                        value={Object.keys(values).length !== 0 && typeof values.pregnancy_count === 'number' ? values.pregnancy_count : null}
                        label="How many times have you been pregnant?"
                        placeholder='Enter your pregnancy count'
                        type='number'
                        required
                        disabled={!writeMode}
                        onChange={(e) => setValues({ ...values, pregnancy_count: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <PregnantWoman />
                                </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">times</InputAdornment>,
                        }}
                        variant='outlined'
                        size='small'
                    />
                }

                {writeMode && <Button type='submit' disabled={submit} variant='contained' className='my-2'>{firstVisit ? 'Save' : 'Update'} Data</Button>}
            </form>

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
        </Layout>
    );
}

export default Data;