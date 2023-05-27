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
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);
  const [symbols, setSymbols] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ENDPOINT_URL='https://api.exchangeratesapi.io/v1';
  const ENDPOINT_ACCESSKEY='7227d246704ce3ee8e345f4137819b14';

  const url_allsymbols = `${ENDPOINT_URL}/symbols?access_key=${ENDPOINT_ACCESSKEY}`;
  const url_convert = `${ENDPOINT_URL}/latest?access_key=${ENDPOINT_ACCESSKEY}`;
  

  useEffect(() => {
    fetch(url_allsymbols)
        .then((response) => response.json())
        .then((data) => {
          if(data.success)
          {
            setSymbols(data.symbols);
            setError('');
          }
          else
          {
            setError(data.error.info);
          }
        })
        .catch((err) => {
          setError(err.message);
          setFrom('');
          setTo('');
        })
        .finally(() => {
          setLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

  const handleChangeFrom = (value: string) => {
    setFrom(value);
  };

  const handleChangeTo = (value: string) => {
    setTo(value);
  };

  const handleChangeAmount = (value: string) => {
      setAmount(parseInt(value));
  };

  const handleClickConvert = () => {
    
    if(to!='' && from!='')
    {
      //const urlfetch= `${url_convert}&from=${from}&to=${to}&amount=${amount}`;
      setLoading(true);
      fetch(`${url_convert}`)
          .then((response) => response.json())
          .then((data) => {
            if(data.success)
            {
              var json_data = data.rates;
              var result = [];

              var vfrom=0;
              var vto=0;
              for(var i in json_data)
              {
                result.push([i, json_data [i]]);
                if(i==from)
                  vfrom=json_data [i];

                if(i==to)
                  vto=json_data [i];  
              }
              
              var v1= (amount*vfrom) - (amount*vto); 
              var v2= amount-v1;
              var vrate= v2/amount;

              setResult(v2);
              setRate(vrate);
              setError('');
            }
            else
            {
              setResult(data.error.message);
            }
          })
          .catch((err) => {
            setError(err.message);
            setFrom('');
            setTo('');
          })
          .finally(() => {
            setLoading(false);
          });
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
            onChange={(e) => handleChangeAmount(e.target.value)}
          />
          <FormControl className={classes.form}>
            <InputLabel id="lfrom">From</InputLabel>
            <Select
              labelId="lfrom"
              id="sfrom"
              value={from}
              label="From"
              onChange={(e) => handleChangeFrom(e.target.value)}
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
            onChange={(e) => handleChangeTo(e.target.value)}
          >
            {symbols &&
                Object.keys(symbols).map(id => (
                <MenuItem key={id} value={id}>{id} - ({symbols[id]})</MenuItem>
              ))}
          </Select>
          </FormControl>
          
          <Button variant="contained" onClick={handleClickConvert}>Convert</Button>
          <div>
            {
              result!=0?'Result: '+ result:''
            }
          </div>
          <div>
            {
              rate!=0?'Rate: '+ rate:''
            }
          </div>
        </Stack>
  );
}
