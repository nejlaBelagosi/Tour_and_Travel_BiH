import * as React from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "../styles/Login.css"

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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });
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
          className ='grid'
          sx={{
            // backgroundImage: 'url(../img/Login.jpg)',
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
            <Typography component="h1" variant="h5" style={{color:'#4F6F52'}}>
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="email"
                autoComplete="username"
                autoFocus
                sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                        color:'#4F6F52'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                        color:'#4F6F52'
                      },
                      '& input': {
                        color: '#4F6F52', // Boja teksta
                        font:'Montserrat'
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52', // Boja teksta kada je fokusirano
                        font:'Montserrat'
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)', // Default label color
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52', // Label color when focused
                    }
                  }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                        color:'#4F6F52'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                        color: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52', // Boja teksta
                        font:'Montserrat'
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52', // Boja teksta kada je fokusirano
                        font:'Montserrat'
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)', // Default label color
                      
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52', // Label color when focused
                    }
                  }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" style={{color: "#4F6F52"}} />}
                label="Remember me"
                style={{color: "#4F6F52", font:'Montserrat'}}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{backgroundColor: "#4F6F52", font:'Montserrat'}}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" style={{color: "#4F6F52", font:'Montserrat'}}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/Registration" variant="body2" style={{color: "#4F6F52", font:'Montserrat'}}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} style={{font:'Montserrat'}} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}