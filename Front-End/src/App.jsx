import { Routes, Route, Navigate } from 'react-router-dom';
import Sign from './views/user/Sign';
import Data from './views/user/Data';
import Home from './views/home/Home';
import Disease from './views/disease/Disease';
import NotFound from './views/miscellaneous/NotFound';
import PredictionHistory from './views/disease/PredictionHistory';
import { useUser } from './contexts/UserContext';
import { useEffect } from 'react';
import { CircularProgress, Container } from '@mui/material';

const App = () => {
    const { user, setUser, Decrypt } = useUser();
    console.log('user NOW')
    console.log(user)

    const initial = async() => {
        const token = localStorage.getItem('token');

        if(token) {
            await Decrypt(localStorage.getItem('token'));
        } else {
            setUser({});
        }
    }

    useEffect(() => {
        initial();
    }, []);

    return (
        <>
            {
                user === null ? <Container className='container d-flex justify-content-center align-items-center'>
                    <CircularProgress />
                </Container>
                : <Routes>
                    <Route path="/" element={
                        user.user ? user.data ? <Navigate to='/home' replace />
                            : <Navigate to='/user/data' replace state={{ first: true }} />
                        : <Navigate to='/signin' replace />
                    } />
        
                    <Route path="/signup" element={
                        user.user && user.data ? <Navigate to='/home' replace />
                        : <Sign />
                    } />
        
                    <Route path="/signin" element={
                        user.user && user.data ? <Navigate to='/home' replace />
                        : <Sign />
                    } />
                    
                    <Route path="/home" element={
                        user.user ? user.data ? <Home />
                            : <Navigate to='/user/data' replace state={{ first: true }} />
                        : <Navigate to='/signin' replace />
                    } />
        
                    <Route path="/user/data" element={
                        user.user ? <Data />
                        : <Navigate to='/signin' replace />
                    } />
        
                    <Route path="/predict/history" element={
                        user.user && user.data ? <PredictionHistory />
                        : <Navigate to='/signin' replace />
                    } />
        
                    <Route path="/404" element={<NotFound />} />
        
                    <Route path="/:disease" element={
                        user.user ? user.data ? <Disease />
                            : <Navigate to='/user/data' replace state={{ first: true }} />
                        : <Navigate to='/signin' replace />
                    } />
                </Routes>
            }
        </>
    );
}

export default App;