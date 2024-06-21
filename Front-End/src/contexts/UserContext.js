import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const token = localStorage.getItem('token');

    const initial = async() => {
        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}user/decrypt/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if(response.data.status) {
                    setUser(response.data.payload);
                } else {
                    localStorage.removeItem('token');
                    setUser({});
                    navigate('/signin');
                }
            }).catch(() => {
                localStorage.removeItem('token');
                setUser({});
                navigate('/signin');
            });
        }
    }

    useEffect(() => {
        initial();
    }, []);

    const SignUp = async(body) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}user/signup/`, body);

            if(response.data.status) {
                localStorage.setItem('token', response.data.payload.token);
                setUser({ user: response.data.payload.user });

                return { status: true, message: 'Sign up success.' };
            } else {
                return { status: false, message: 'Sign up failed.' };
            }
        } catch(e) {
            return { status: false, message: `Sign up error: ${e}.` };
        }
    }

    const SignIn = async(body) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}user/signin/`, body);

            if(response.data.status) {
                const user = response.data.payload.user;

                const getData = await GetUserData(response.data.payload.token);
                
                if(getData.data.status) {
                    const data = getData.data.payload.data;

                    localStorage.setItem('token', response.data.payload.token);
                    setUser({ user, data });

                    return { status: true, message: 'Sign in success.' };
                } else {
                    return { status: false, message: 'Sign in failed: Failed to get user data.' };
                }
            } else {
                return { status: false, message: 'Sign in failed.' };
            }
        } catch(e) {
            return { status: false, message: `Sign in error: ${e}.` };
        }
    }

    const SignOut = () => {
        try {
            localStorage.removeItem('token');
            setUser({});
            return { status: true, message: 'Sign out success.' };
        } catch(e) {
            return { status: false, message: `Sign out error: ${e}.` };
        }
    }

    const Decrypt = async(token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}user/decrypt/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.status) {
                setUser(response.data.payload);
            }
        } catch(e) {
            throw e;
        }
    }

    const PostUserData = async(body, token) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}user/data/`, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.status) {
                setUser({ ...user, data: response.data.payload.data })
                return { status: true, message: 'Post user data success.' };
            } else {
                return { status: false, message: 'Post user data failed.' };
            }
        } catch(e) {
            return { status: false, message: `Post user data error: ${e}.` };
        }
    }

    const GetUserData = async(token) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}user/data/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    }

    const PatchUserData = async(body, token) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}user/data/`, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.status) {
                setUser({ ...user, data: response.data.payload.data })
                return { status: true, message: 'Patch user data success.' };
            } else {
                return { status: false, message: 'Patch user data failed.' };
            }
        } catch(e) {
            return { status: false, message: `Patch user data error: ${e}.` };
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, SignUp, SignIn, SignOut, Decrypt, PostUserData, GetUserData, PatchUserData }}>
            { children }
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);