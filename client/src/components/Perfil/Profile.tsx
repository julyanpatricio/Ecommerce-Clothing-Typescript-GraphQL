import React, { useState } from 'react'
import {useAuth0} from '@auth0/auth0-react'
import Logout from '../Logout'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(3),
    width: '25ch'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
}));


export default function Profile() {
  const {user, isAuthenticated, isLoading} = useAuth0()
  const classes = useStyles();
  if(isLoading) return <div>Loading...</div>


  const handleChange = (event) => {
    
  };

  return (
    isAuthenticated && <div>
      <div className='div-conteiner'>
                <h3>Profile</h3>
            <div className='conteiner-perfil'>
                <h6>-Data</h6>
                <h6>-Change password</h6>
            </div>
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                <TextField
                  id="standard-multiline-flexible"
                  label="Name"
                  multiline
                  maxRows={4}
                  
                />
                <TextField
                  id="standard-multiline-flexible"
                  label="Last name"
                  multiline
                  maxRows={4}
                  
                />
                <InputLabel >Sex</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  placeholder="Select an option"
                  id="demo-simple-select-helper"
                  className={classes.selectEmpty}
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  <MenuItem value={20}>Male</MenuItem>
                  <MenuItem value={30}>Female</MenuItem>
                </Select>
                <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    defaultValue="00-00-0000"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                <TextField
                  id="standard-multiline-flexible"
                  label="DNI"
                  multiline
                  maxRows={4}
                  
                />
                <TextField
                  id="standard-multiline-flexible"
                  label="Email"
                  multiline
                  maxRows={4}
                  
                />
                </div>
              </form>
        </div>
      <img src={user.picture} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <Logout />
    </div>
  )
}