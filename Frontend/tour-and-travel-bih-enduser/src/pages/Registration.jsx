import React, { useState } from 'react';
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

const defaultTheme = createTheme();

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const registrationData = {
      name: data.get('firstName'),
      surname: data.get('lastName'),
      address: data.get('address'),
      dateOfBirth: data.get('dateOfBirth'),
      contact: data.get('contact'),
      email: data.get('email'),
      accountTypeId: 1, // Primer ID-a tipa naloga
      username: data.get('username'),
      userPassword: data.get('password'),
      userImage: '' // Dodajte polje za sliku korisnika ako je potrebno
    };

    try {
      const response = await fetch('http://localhost:5278/api/Users/RegisterUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log(result);
      alert('User successfully created! Redirecting to login page...');
      window.location.href = '/login';
    } catch (error) {
      console.error("There was an error registering the user!", error);
      setErrorMessage(error.message);
    }
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
          {errorMessage && (
            <Box sx={{ color: 'red', mt: 2 }}>
              {errorMessage}
            </Box>
          )}
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
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
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
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="dateOfBirth"
                  label="Date of Birth"
                  name="dateOfBirth"
                  autoComplete="dateOfBirth"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contact"
                  label="Contact"
                  name="contact"
                  autoComplete="contact"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
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
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
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
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
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
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" style={{color:"#4F6F52"}} />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{backgroundColor: "#4F6F52"}}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2" style={{color:"#4F6F52"}}>
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
