import React, { useState } from 'react'
import { CenteredFlexBox } from '../styled';
import { FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import { BoardArray, ClueStatus, PossibleClueStatus } from './types';
import ClueCard from './ClueCard';
import useOrientation from '@/hooks/useOrientation';
import DailyDouble from '@/pages/Home/DailyDouble';
import { Container } from '@mui/system';

interface BoardProps {
  round?: "JEOPARDY" | "DOUBLE JEOPARDY" | "FINAL JEOPARDY";
  locked?: boolean;
  board: BoardArray,
  setBoard: any, // function
  score: number,
}

function Board({ locked = false, round = "JEOPARDY", board, setBoard, score }: BoardProps) {
  const [dailyDouble, setDailyDouble] = useState<boolean>(false);
  const multiplier = round === "JEOPARDY" ? 1 : round === "DOUBLE JEOPARDY" ? 2 : 0;
  const baseValue = 200 * multiplier;
  const isPortrait = useOrientation();

  const widthMod = isPortrait ? 0.4 : 1;

  const cycleBoardItem = (yIndex: number, xIndex: number) => {
    let clueStatusMessages = ["UNANSWERED", "CORRECT", "INCORRECT"];
    let copyOfBoard: BoardArray = JSON.parse(JSON.stringify(board));
    let currentClueStatus: ClueStatus = copyOfBoard[yIndex][xIndex];
    currentClueStatus.status = (clueStatusMessages[(clueStatusMessages.indexOf(currentClueStatus.status)+1) % (clueStatusMessages.length)]) as PossibleClueStatus;
    copyOfBoard[yIndex][xIndex] = currentClueStatus;
    setBoard(copyOfBoard);
  }

  return (
    <>
      <CenteredFlexBox flexDirection={"column"}>
        <FormGroup>
          <FormControlLabel control={<Switch checked={dailyDouble} onChange={() => {let dd = Boolean(dailyDouble); setDailyDouble(!dd)}} />} label="Edit Mode (for DD)" />
        </FormGroup>
        {dailyDouble && <>
          <Container sx={{ padding: "2rem" }}>
          <Typography variant="h3">Daily Double Mode Active!</Typography>
          <Typography variant="h4">Select a clue to set its value to your wager.</Typography>
          <Typography variant="body1">Daily double denoted with * if already selected for the round; select again to remove an incorrectly marked DD.</Typography>
          </Container>
        </>}
      </CenteredFlexBox>
      <CenteredFlexBox flexDirection={"column"}>
        <Typography variant="h4">{round}</Typography>
        {/* <Box> */}
          <Grid gap={1}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > :not(style)': {
                // m: 1,
                // marginBottom: 1,
                width: 128 * widthMod,
                height: 128 * widthMod,
              },
            }}>
            {board.map((category, categoryIdx) => {
              return (<Grid key={`cat-${categoryIdx}`} gap={1}>
                {category.map((clue, clueIdx) => {
                  const [val, setVal] = useState<number>(baseValue * (clueIdx + 1));
                  const [dailyDoubleOpen, setDailyDoubleOpen] = useState<boolean>(false);
                  const [dailyDoubleWager, setDailyDoubleWager] = useState<number>(0);
                  const closeDailyDouble = (event: any, reason: string) => {
                    if (reason && reason == "backdropClick") 
                      return;
                    setDailyDoubleOpen(false);
                    setDailyDoubleWager(0);
                  }
                  const saveDailyDouble = () => {
                    setVal(dailyDoubleWager)
                    setDailyDoubleOpen(false);
                    let copyOfBoard: BoardArray = JSON.parse(JSON.stringify(board));
                    copyOfBoard[categoryIdx][clueIdx].value = dailyDoubleWager;
                    copyOfBoard[categoryIdx][clueIdx].dailyDouble = true;
                    setBoard(copyOfBoard);
                  };

                  return (
                    <Grid key={`clue-${clueIdx}`} gap={1}>
                      <DailyDouble open={dailyDoubleOpen} handleClose={closeDailyDouble} handleSaveAndClose={saveDailyDouble} round={round} score={score} setWager={setDailyDoubleWager} />
                      <ClueCard
                        dailyDouble={dailyDouble}
                        setDailyDouble={setDailyDouble}
                        onDailyDouble={() => {
                          setDailyDoubleOpen(true);
                        }}
                        onClick={() => {
                          cycleBoardItem(categoryIdx, clueIdx)}
                        }
                        wasDailyDouble={clue.dailyDouble}
                        undoDailyDouble={() => {
                          setVal(clue.origValue);
                          let copyOfBoard: BoardArray = JSON.parse(JSON.stringify(board));
                          copyOfBoard[categoryIdx][clueIdx].value = clue.origValue;
                          copyOfBoard[categoryIdx][clueIdx].dailyDouble = undefined;
                          setBoard(copyOfBoard);
                        }}
                        value={val} status={clue} widthMod={widthMod} isPortrait={isPortrait}
                      />
                    </Grid>
                  )
                })}
              </Grid>)
            })}
          </Grid>
        {/* </Box> */}
      </CenteredFlexBox>
      <div style={{ height: "20rem" }} />
    </>
  )
}

export default Board