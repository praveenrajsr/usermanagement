import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { TextField, Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Container from '@mui/material/Container'
import "../assets/main.scss";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const LoginPage = () => {
    let { loginUser, loginErr } = useContext(AuthContext)
    const [snackbar, setSnackBar] = useState(null)
    const handleCloseSnackbar = () => setSnackBar(null);

    useEffect(() => {
        if (loginErr) setSnackBar({ children: "Username or password doesn't match", severity: 'error' })
    }, [loginErr])

    return (
        <Container>
            <Grid className='flex-center'>
                <div className='form-container'>
                    <form className='login-form' onSubmit={loginUser}>
                        <h1 className='text-center'>Login</h1>
                        <div style={{ paddingTop: '25px' }}>
                            <TextField className='w-100' id="username" name='username' label="Mobile Number" variant="outlined" inputProps={{ maxLength: 10 }} required />
                        </div>
                        <div style={{ paddingTop: '25px' }}>
                            <TextField className='w-100' id="password" type='password' name='password' label="Password" variant="outlined" required />
                        </div>
                        <div style={{ paddingTop: '25px' }}>
                            <Button className='w-100' type="submit" variant="contained">Login</Button>
                        </div>
                    </form>
                </div>
            </Grid>
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </Container>
    )
}

export default LoginPage