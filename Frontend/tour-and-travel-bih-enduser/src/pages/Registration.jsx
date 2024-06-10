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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import "../styles/Registration.css";

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

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: null,
    contact: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    // Validacija emaila
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format. Example: example@example.com';
    }

    // Validacija sifre
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must have at least 8 characters, one uppercase letter, one number, and one special character.';
    }

    // Provjera sifri
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Provjera obaveznih polja
    ['firstName', 'lastName', 'email', 'username', 'password', 'confirmPassword'].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'Required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const registrationData = {
      name: formData.firstName,
      surname: formData.lastName,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,
      contact: formData.contact,
      email: formData.email,
      accountTypeId: 1,
      username: formData.username,
      userPassword: formData.password,
      userImage: '',
    };

    try {
      const response = await fetch('http://localhost:5278/api/Users/RegisterUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('Korisničko ime je već zauzeto')) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: 'Username is already taken',
          }));
        }
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log(result);
      alert('User successfully created! Redirecting to login page...');
      window.location.href = '/login';
    } catch (error) {
      console.error("There was an error registering the user!", error);
      setErrorMessage(`There was an error registering the user: ${error.message}`);
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
            <LockOutlinedIcon style={{ color: "white" }} />
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
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.firstName ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.6)',
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
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.lastName ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.6)',
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
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.address ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.address ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.address ? 'red' : 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end">
                                <CalendarMonthIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: errors.dateOfBirth ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#4F6F52',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F6F52',
                            },
                            '& input': {
                              color: errors.dateOfBirth ? 'red' : '#4F6F52',
                            },
                            '&.Mui-focused input': {
                              color: '#4F6F52',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: errors.dateOfBirth ? 'red' : 'rgba(0, 0, 0, 0.6)',
                            
                          },
                          '& .Mui-focused .MuiInputLabel-root': {
                            color: '#4F6F52',
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contact"
                  label="Contact"
                  name="contact"
                  autoComplete="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  error={!!errors.contact}
                  helperText={errors.contact}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.contact ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.contact ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.contact ? 'red' : 'rgba(0, 0, 0, 0.6)',
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
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.email ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.email ? 'red' : 'rgba(0, 0, 0, 0.6)',
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
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.username ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.username ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.username ? 'red' : 'rgba(0, 0, 0, 0.6)',
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.password ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.password ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.password ? 'red' : 'rgba(0, 0, 0, 0.6)',
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
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.confirmPassword ? 'red' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F6F52',
                      },
                      '& input': {
                        color: errors.confirmPassword ? 'red' : '#4F6F52',
                      },
                      '&.Mui-focused input': {
                        color: '#4F6F52',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: errors.confirmPassword ? 'red' : 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#4F6F52',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" style={{ color: "#4F6F52" }} />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "#4F6F52" }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2" style={{ color: "#4F6F52" }}>
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