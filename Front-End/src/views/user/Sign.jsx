import { React, useState } from 'react';
import { Container, Box, TextField, InputAdornment, Button, IconButton, Alert, Link } from '@mui/material';
import { Person, Email, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Sign = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const type = location.pathname.slice(-2);
    const { user, SignIn, SignUp, GetUserData, setUser } = useUser();
    const [showPassword, setShowPassword] = useState({ password: false, confirmation: false });
    const [values, setValues] = useState({});
    const [submit, setSubmit] = useState(false);
    
    const sign = async(e) => {
        e.stopPropagation();
        e.preventDefault();

        let response;
        setSubmit(true);
        
        if(type === 'up') {
            if(values.password !== values.confirmation) {
                response = { status: false, message: 'Password confirmation does not match.' };
            } else {
                response = await SignUp(values);
            }
        } else if(type === 'in') {
            response = await SignIn(values);
        }
        
        if(response.status) {
            toast.success(<Alert severity="success">{response.message}</Alert>, { icon: false });

            if(type === 'up') {
                navigate('/user/data', { state: { first: true } })
            } else if(type === 'in') {
                navigate('/home')
            }
        } else {
            toast.error(<Alert severity="error">{response.message}</Alert>, { icon: false });
        }

        setSubmit(false);
    }
    
    return (
        <Container className='container d-flex justify-content-center align-items-center'>
            <Box maxWidth='md' className='sign d-flex justify-content-center align-items-center'>
                <img src='img/medical-technology.jpg' alt='Medical Technology' />
                <Box className='p-5 flex flex-column justify-content-center align-items-center'>
                    <h2 className='mb-5'>Sign {type.replace(/\b\w/g, match => match.toUpperCase())}</h2>

                    <form onSubmit={(e) => sign(e)} className='d-flex flex-column'>
                        {
                            type === 'up' && <TextField
                                className='mb-4'
                                value={values.full_name ? values.full_name : ''}
                                label='Full Name'
                                placeholder='Enter your full name'
                                type='text'
                                required
                                onChange={(e) => setValues({ ...values, full_name: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                                variant='outlined'
                                size='small'
                            />
                        }

                        <TextField
                            className='mb-4'
                            value={values.email ? values.email : ''}
                            label='Email'
                            placeholder='Enter your email'
                            type='email'
                            required
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                            variant='outlined'
                            size='small'
                        />

                        <TextField
                            className='mb-4'
                            value={values.password ? values.password : ''}
                            label='Password'
                            placeholder='Enter your password'
                            type={showPassword.password ? 'text' : 'password'}
                            required
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Password />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                                            edge='end'
                                        >
                                            {showPassword.password ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            variant='outlined'
                            size='small'
                        />

                        {
                            type === 'up' && <TextField
                                className='mb-4'
                                value={values.confirmation ? values.confirmation : ''}
                                label='Confirm Password'
                                placeholder='Confirm your password'
                                type={showPassword.confirmation ? 'text' : 'password'}
                                required
                                onChange={(e) => setValues({ ...values, confirmation: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Password />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, confirmation: !showPassword.confirmation })}
                                                edge='end'
                                            >
                                                {showPassword.confirmation ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                variant='outlined'
                                size='small'
                            />
                        }

                        <Button type='submit' disabled={submit} variant='contained' className='my-2'>Sign {type.replace(/\b\w/g, match => match.toUpperCase())}</Button>

                        {type === 'up' && <p className='text-muted d-flex justify-content-center align-items-center'>Have an account?<Link className='ms-2 fw-bold text-decoration-none' underline='none' href='/signin'>Sign In</Link></p>}
                        {type === 'in' && <p className='text-muted d-flex justify-content-center align-items-center'>Don't have an account?<Link className='ms-2 fw-bold text-decoration-none' underline='none' href='/signup'>Sign Up</Link></p>}
                        
                    </form>
                </Box>
            </Box>
            
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
        </Container>
    );
}

export default Sign;