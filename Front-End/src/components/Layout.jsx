import { ExpandMore, MedicalInformation, Badge, Dvr, Logout } from "@mui/icons-material";
import { AppBar, Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Alert, Link } from "@mui/material";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, SignOut } = useUser();
    const [expand, setExpand] = useState(false);
    const firstVisit = (location.state !== null && (location.state.first === true || location.state.first === false)) ? location.state.first : user.data ? false : true;
    
    useEffect(() => {
        if(location.pathname === '/home') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, []);

    const signOut = () => {
        const response = SignOut()

        if(response.status) {
            toast.success(<Alert severity="success">{response.message}</Alert>, { icon: false });
            navigate('/signin')
        } else {
            toast.error(<Alert severity="error">{response.message}</Alert>, { icon: false });
        }
    }

    return (
        <div>
            <AppBar position="sticky">
                <Toolbar className="bar d-flex justify-content-between align-items-center">
                    <Box className="d-flex justify-content-center align-items-center">
                        <Link href="/home" underline='none' className="home fw-bold d-flex justify-content-center align-items-center">
                            <MedicalInformation className="me-2 text-primary" />
                            Health Risk Assessment Tool v1.0
                        </Link>
                    </Box>

                    <Box className="user d-flex justify-content-center align-items-center" onClick={() => setExpand(!expand)}>
                        {user.user.full_name}
                        <ExpandMore className="ms-2" />
                    </Box>
                </Toolbar>

                {
                    !(location.pathname === '/user/data' && firstVisit) && expand && <Box className="position-relative">
                        <Paper className="menu position-absolute">
                            <List>
                                <ListItem disablePadding onClick={() => navigate('/user/data', { state: { first: false } })}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Badge />
                                        </ListItemIcon>
                                        <ListItemText primary="Personal Data" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding onClick={() => navigate('/predict/history')}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Dvr />
                                        </ListItemIcon>
                                        <ListItemText primary="Prediction History" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding onClick={() => signOut()}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Logout />
                                        </ListItemIcon>
                                        <ListItemText primary="Sign Out" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                }
            </AppBar>

            <Box className={location.pathname === '/home' ? 'landing' : location.pathname === '/user/data' ? "main pt-5 pb-5" : 'page pt-5 pb-5'}>
                {children}
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
        </div>
    );
}

export default Layout;