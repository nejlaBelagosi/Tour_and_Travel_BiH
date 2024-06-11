import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "../styles/Login.css";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Tour and Travel BiH
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Home');
    }
  }, [navigate]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      username,
      userPassword: password,
    };

    try {
      const response = await fetch('http://localhost:5278/auth/Adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : { message: 'Unknown error' };

        if (response.status === 403) {
          setError('Nemate autorizovan pristup.');
        } else if (response.status === 400) {
          setError(errorData.message || 'Invalid username or password');
        } 
        return;
      }

      const result = await response.json();

      if (result.token) {
        // Store user info in local storage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        localStorage.setItem('tokenId', result.tokenId);

        // Redirect to home page based on AccountTypeId
        navigate('/Home');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      if (error.message === 'Nemate autorizovan pristup.') {
        setError('Nemate dozvolu pristupa stranici.');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className='grid'
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'white',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#4F6F52' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{ color: '#4F6F52' }}>
              Sign in
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4F6F52',
                      color: '#4F6F52',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4F6F52',
                      color: '#4F6F52',
                    },
                    '& input': {
                      color: '#4F6F52', // Text color
                      font: 'Montserrat',
                    },
                    '&.Mui-focused input': {
                      color: '#4F6F52', // Text color when focused
                      font: 'Montserrat',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.6)', // Default label color
                  },
                  '& .Mui-focused .MuiInputLabel-root': {
                    color: '#4F6F52', // Label color when focused
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4F6F52',
                      color: '#4F6F52',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4F6F52',
                      color: '#4F6F52',
                    },
                    '& input': {
                      color: '#4F6F52', // Text color
                      font: 'Montserrat',
                    },
                    '&.Mui-focused input': {
                      color: '#4F6F52', // Text color when focused
                      font: 'Montserrat',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.6)', // Default label color
                  },
                  '& .Mui-focused .MuiInputLabel-root': {
                    color: '#4F6F52', // Label color when focused
                  },
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" style={{ color: "#4F6F52" }} />}
                label="Remember me"
                style={{ color: "#4F6F52", font: 'Montserrat' }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ backgroundColor: "#4F6F52", font: 'Montserrat' }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" style={{ color: "#4F6F52", font: 'Montserrat' }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/Registration" variant="body2" style={{ color: "#4F6F52", font: 'Montserrat' }}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} style={{ font: 'Montserrat' }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
