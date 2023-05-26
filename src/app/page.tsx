"use client";
import React, {useState, useEffect} from 'react';
import Stack from '@mui/material/Stack';
import { TextField, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from '@mui/styles';
import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";


const useStyles = makeStyles({
  form: {
    width: '15%',
  },
});

const Button = styled(MuiButton)((props) => ({
  borderRadius: 50
}));

export default function Home() {

  const classes = useStyles();
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [result, setResult] = useState('');
  const [rate, setRate] = useState('');
  const [symbols, setSymbols] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ENDPOINT_URL='http://api.exchangeratesapi.io/v1';
  const ENDPOINT_ACCESSKEY='7227d246704ce3ee8e345f4137819b14';

  const url_allsymbols = `${ENDPOINT_URL}/symbols?access_key=${ENDPOINT_ACCESSKEY}`;
  const url_convert = `${ENDPOINT_URL}/convert?access_key=${ENDPOINT_ACCESSKEY}`;
  

  useEffect(() => {
    fetch(`${url_allsymbols}`)
        .then((response) => response.json())
        .then((data) => {
          if(data.success)
          {
            setSymbols(data.symbols);
            setError(null);
          }
          else
          {
            setError(data.error.info);
          }
        })
        .catch((err) => {
          setError(err.message);
          setFrom(null);
          setTo(null);
        })
        .finally(() => {
          setLoading(false);
        });

   }, []);

  const handleChangeFrom = (event: SelectChangeEvent) => {
    setFrom(event.target.value);
  };

  const handleChangeTo = (event: SelectChangeEvent) => {
    setTo(event.target.value);
  };

  const handleChangeAmount = (event) => {
      setAmount(event.target.value);
  };

  const handleClickConvert = () => {
    if(to!=null && from!=null)
    {
      const urlfetch= `${url_convert}&from=${from}&to=${to}&amount=${amount}`;
      fetch(`${urlfetch}`)
          .then((response) => response.json())
          .then((data) => {
            if(data.success)
            {
              setResult(data.result);
              setError(null);
            }
            else
            {
              setResult(data.error.message);
            }
          })
          .catch((err) => {
            setError(err.message);
            setFrom(null);
            setTo(null);
          })
    }
  };

  return (
        <Stack direction="column" spacing={2} justifyContent="center"
        alignItems="center">
          {loading && <div>A moment please...</div>}
          {error && (
            <div>{`There is a problem fetching the data - ${error}`}</div>
          )}
          <TextField 
            id="amount" 
            type="number"
            value={amount}
            InputLabelProps={{
              shrink: true,
            }} 
            label="Amount" 
            required
            className={classes.form}
            onChange={handleChangeAmount}
          />
          <FormControl className={classes.form}>
            <InputLabel id="lfrom">From</InputLabel>
            <Select
              labelId="lfrom"
              id="sfrom"
              value={from}
              label="From"
              onChange={handleChangeFrom}
            >
              
              {symbols &&
                Object.keys(symbols).map(id => (
                <MenuItem key={id} value={id}>{id} - ({symbols[id]})</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.form}>
          <InputLabel id="lto">To</InputLabel>
          <Select
            labelId="lto"
            id="sto"
            value={to}
            label="To"
            onChange={handleChangeTo}
          >
            {symbols &&
                Object.keys(symbols).map(id => (
                <MenuItem key={id} value={id}>{id} - ({symbols[id]})</MenuItem>
              ))}
          </Select>
          </FormControl>
          
          <Button variant="contained" onClick={handleClickConvert}>Convert</Button>
          <div>
            Result: {result}
          </div>
          <div>
            {
              rate!=''?'Rate:'+ rate:''
            }
          </div>
        </Stack>
  );
}
