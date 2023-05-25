import { Box, Button, FormControlLabel, FormGroup, Paper, Switch, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react'
import { ClueStatus } from './types';
import { FullSizeCenteredFlexBox } from '../styled';
import useTheme from '@/store/theme';
import { createTheme } from '@mui/material/styles';
import themes from '@/theme/themes';

interface ClueCardProps {
  status: ClueStatus;
  value: number;
  isPortrait?: boolean;
  widthMod?: number;
  onClick?: any;
  onDailyDouble?: any;
  dailyDouble: boolean;
  setDailyDouble: any;
  wasDailyDouble?: boolean;
  undoDailyDouble: any;
  skipClue?: any;
  resetClue?: any;
  gotRight?: any;
  gotWrong?: any;
  columnNumber: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ClueCard({ status, value, isPortrait = false, widthMod = 1, onClick, dailyDouble, setDailyDouble, onDailyDouble, wasDailyDouble, undoDailyDouble, skipClue, resetClue, gotRight, gotWrong, columnNumber }: ClueCardProps) {
  const [theme] = useTheme();
  const themeRef = createTheme(themes[theme]);

  const colorOptions = {
    "UNANSWERED": themeRef.palette.background.paper,
    "SKIP": themeRef.palette.action.selected,
    "CORRECT": "#00ff00",
    "INCORRECT": "#ff0000",
  };

  const [clueOpen, setClueOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={ () => {
        if(dailyDouble === true){
          if(wasDailyDouble === false){
            onDailyDouble();
          } else {
            undoDailyDouble();
          }
          setDailyDouble(false);
        }
        // else if(onClick) {
        //   onClick();
        // }
        else {
          setClueOpen(true);
        }
      }}
      >
        <Paper sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            // m: 1,
            width: 128 * widthMod,
            height: 128 * widthMod,
          },
          backgroundColor: !dailyDouble ? colorOptions[status.status] : (["CORRECT", "INCORRECT"].includes(status.status) ? colorOptions[status.status] : "#e6aa5c"),
          color: themeRef.palette.getContrastText(!dailyDouble ? colorOptions[status.status] : (["CORRECT", "INCORRECT"].includes(status.status) ? colorOptions[status.status] : "#e6aa5c"))
        }}
        >
          <FullSizeCenteredFlexBox>
            <Typography variant={!isPortrait ? 'h4' : 'h6'} sx={{ userSelect: "none" }}>
              {value}{wasDailyDouble && '*'}
            </Typography>
          </FullSizeCenteredFlexBox>
        </Paper>
      </Button>
      <Dialog
        open={clueOpen}
        onClose={() => {
          if(status.dailyDouble !== true){
            setClueOpen(false);
          }
        }}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Column {columnNumber} for {value}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {/* Clue worth {value}. */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <FormGroup>
                <FormControlLabel control={<Switch disabled={status.status !== "UNANSWERED"} value={status.dailyDouble === true} defaultChecked={status.dailyDouble === true} onChange={() => { // TODO: defaultChecked shouldn't need to be here; investigate
                  if(!wasDailyDouble){
                    onDailyDouble();
                  } else {
                    undoDailyDouble();
                  }
                }} />} label="Daily Double?" />
              </FormGroup>
              {status.dailyDouble === true && <>
                Daily Double! The clue was originally worth {status.origValue} and you wagered {value}.
              </>}
            </Box>
            {status.status !== "UNANSWERED" && <>
              <br />
              <Button size={"large"} disabled={status.status.toString() === "UNANSWERED"} variant="contained" color="warning" onClick={() => {
                resetClue();
              }}>Reset clue?</Button>
            </>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size={"large"} disabled={status.status !== "UNANSWERED"} variant="contained" color="success" onClick={() => {
            gotRight();
            setClueOpen(false);
          }}>Correct</Button>
          <Button size={"large"} disabled={status.status !== "UNANSWERED"} variant="contained" color="error" onClick={() => {
            gotWrong();
            setClueOpen(false);
          }}>Incorrect</Button>
          <Button size={"large"} disabled={status.status !== "UNANSWERED" || status.dailyDouble === true} variant="contained" color="primary" onClick={() => {
            skipClue();
            setClueOpen(false);
          }}>Didn't Answer</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ClueCard