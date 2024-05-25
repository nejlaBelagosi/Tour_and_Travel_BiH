import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "../styles/Registration.css"

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

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      username: data.get('username'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="registration-box"
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#4F6F52' }}>
            <LockOutlinedIcon style={{color:"white"}}/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
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
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52', // Boja teksta kada je fokusirano
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)', // Default label color
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52', // Label color when focused
                    }
                  }}
                  style={{font:'Montserrat'}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52', // Boja teksta kada je fokusirano
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
                </Grid>
                <Grid item xs={12}>
                 <TextField 
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
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
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52', // Boja teksta kada je fokusirano
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
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
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" style={{color:"#4F6F52", font:'Montserrat'}} />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{backgroundColor: "#4F6F52", font:'Montserrat'}}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/Login" variant="body2" style={{color:"#4F6F52", font:'Montserrat'}}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}