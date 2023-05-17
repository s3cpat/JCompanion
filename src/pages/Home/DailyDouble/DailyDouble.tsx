import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import React, { useState } from 'react'

interface Props {
  open: boolean,
  handleClose: any, // function
  setWager: any, // function
  round: string,
  score: number,
  handleSaveAndClose: any, // function
}

function DailyDouble(props: Props) {
  const open = props.open;
  const handleClose = props.handleClose;
  const handleSaveAndClose = props.handleSaveAndClose;
  const setWager = props.setWager;
  const score = props.score;
  const round = props.round;

  const [localWager, setLocalWager] = useState<number>(0);
  const saveWager = () => {
    handleSaveAndClose(localWager);
    setLocalWager(0);
  }
  
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Daily Double"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make your wager!
          </DialogContentText>
          <TextField
              helperText="Please enter your wager"
              id="wager"
              label="Wager"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={localWager}
              onChange={(e: { target: { value: string; }; }) => {
                let value = parseInt(e.target.value, 10);
                let multiplier = round === "JEOPARDY" ? 1 : 2;
                if (score <= 1000*multiplier) {
                  if (value > 1000*multiplier) value = 1000*multiplier;
                } else {
                  if (value > score) value = score;
                }
                if (value < 0) value = 0;
                if (isNaN(value)) value = 0;
                setLocalWager(value);
                setWager(value);
              }}
            />
        </DialogContent>
        <DialogActions>
          <Button disabled={localWager === undefined} onClick={saveWager} variant="contained" color="info">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DailyDouble