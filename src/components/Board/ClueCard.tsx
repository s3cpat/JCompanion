import { Button, Paper, Typography } from '@mui/material'
import React from 'react'
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
}

function ClueCard({ status, value, isPortrait = false, widthMod = 1, onClick, dailyDouble, setDailyDouble, onDailyDouble, wasDailyDouble, undoDailyDouble}: ClueCardProps) {
  const [theme] = useTheme();
  const themeRef = createTheme(themes[theme]);

  const colorOptions = {
    "UNANSWERED": themeRef.palette.background.paper,
    "CORRECT": "#00ff00",
    "INCORRECT": "#ff0000",
  };

  return (
    <>
      <Button onClick={ () => {
        if(dailyDouble === true){
          if(!wasDailyDouble){
            onDailyDouble();
          } else {
            undoDailyDouble();
          }
          setDailyDouble(false);
        }
        else if(onClick) {
          onClick();
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
    </>
  )
}

export default ClueCard