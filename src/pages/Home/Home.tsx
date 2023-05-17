import Meta from '@/components/Meta';
import { CenteredFlexBox } from '@/components/styled';

// import { Image } from './styled';
import Board from '@/components/Board';
import { Box } from '@mui/system';
import { BoardArray, Category, ClueStatus } from '@/components/Board/types';
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, Button, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import useNotifications from '@/store/notifications';

function Home() {

  const dateForOutput = dayjs().format("YYYY-MM-DD");

  const [, notificationsActions] = useNotifications();
  const [hasGeneratedOutput, setHasGeneratedOutput] = useState<boolean>(false);

  const [qualifiesForFinal, setQualifiesForFinal] = useState<boolean>(false);

  const createEmptyBoard = (multiplier = 1) => {
    return Array<Category>(6).fill(
      [
        { status: "UNANSWERED", value: 200 * multiplier, origValue: 200 * multiplier },
        { status: "UNANSWERED", value: 400 * multiplier, origValue: 400 * multiplier },
        { status: "UNANSWERED", value: 600 * multiplier, origValue: 600 * multiplier },
        { status: "UNANSWERED", value: 800 * multiplier, origValue: 800 * multiplier },
        { status: "UNANSWERED", value: 1000 * multiplier, origValue: 1000 * multiplier },
      ]
    )
  };

  const [round, setRound] = useState<string>(localStorage.getItem("ROUND") || "JEOPARDY");
  const [score, setScore] = useState<number>(parseInt(localStorage.getItem("SCORE") || "0", 10));

  const [jeopardyRoundBoard, setJeopardyRoundBoard] = useState<BoardArray>(localStorage.getItem("JEOPARYROUNDBOARD") !== null ? JSON.parse(localStorage.getItem("JEOPARYROUNDBOARD") || "") : createEmptyBoard());
  const [doubleJeopardyRoundBoard, setDoubleJeopardyRoundBoard] = useState<BoardArray>(createEmptyBoard(2));

  const advanceToDoubleJeopardy = () => {
    setRound("DOUBLE JEOPARDY");
  };

  const advanceToFinalJeopardy = () => {
    if(score > 0){
      setQualifiesForFinal(true)
    } else {
      setQualifiesForFinal(false);
    }
    setRound("FINAL JEOPARDY");
  };

  const advanceToScore = () => {
    setRound("GAME OVER");
  };

  const resetGame = () => {
    setRound("JEOPARDY");
    setScore(0);
    setJeopardyRoundBoard(createEmptyBoard());
    setDoubleJeopardyRoundBoard(createEmptyBoard(2));
    setFinalWager(0);
    setFinalJeopardyCorrect(undefined);
  };

  const unanswered_emoji = "🟦";
  const correct_emoji = "🟩";
  const incorrect_emoji = "🟥";
  const [jeopardyRoundEmojiScoreboard, setJeopardyRoundEmojiScoreboard] = useState<string>(Array(6).fill(Array(5).fill(unanswered_emoji).join("")).join("\n"));
  const [doubleJeopardyRoundEmojiScoreboard, setDoubleJeopardyRoundEmojiScoreboard] = useState<string>(Array(6).fill(Array(5).fill(unanswered_emoji).join("")).join("\n"));
  const [socialOutput, setSocialOutput] = useState<string>(localStorage.getItem("SOCIALOUT") !== null ? JSON.parse(localStorage.getItem("SOCIALOUT") || "") : "");
  const [finalJeopardyCorrect, setFinalJeopardyCorrect] = useState<undefined | boolean>();

  const [finalWager, setFinalWager] = useState<number>(0);
  const [wagerLocked, setWagerLocked] = useState<boolean>(false);

  const recalculateScore = () => {
    let newScore = 0;
    let roundBoards = [jeopardyRoundBoard, doubleJeopardyRoundBoard];
    roundBoards.forEach((roundBoard) => {
      roundBoard.forEach((category) => {
        category.forEach((clue: ClueStatus) => {
          if (clue.status === "CORRECT") {
            newScore += clue.value;
          }
          else if (clue.status === "INCORRECT") {
            newScore -= clue.value;
          }
        })
      });
    })
    if (finalJeopardyCorrect !== undefined) {
      if (finalJeopardyCorrect === true) {
        newScore += finalWager;
      } else {
        newScore -= finalWager;
      }
    }
    setScore(newScore);
    localStorage.setItem("ROUND", round);
    localStorage.setItem("SCORE", newScore.toString());
    localStorage.setItem("JEOPARYROUNDBOARD", JSON.stringify(jeopardyRoundBoard));
    localStorage.setItem("DOUBLEJEOPARYROUNDBOARD", JSON.stringify(doubleJeopardyRoundBoard));
    localStorage.setItem("SOCIALOUT", JSON.stringify(socialOutput));
  };

  useEffect(() => {
    recalculateScore();
  }, [round, jeopardyRoundBoard, doubleJeopardyRoundBoard, finalJeopardyCorrect]);

  const updateSocialOutput = () => {
    let out = `JCompanion ${dateForOutput}\nJeopardy Round:\n${jeopardyRoundEmojiScoreboard}Double Jeopardy Round:\n${doubleJeopardyRoundEmojiScoreboard}${qualifiesForFinal ? `Final Wager: ${finalWager} (${finalJeopardyCorrect ? "✅" : "❌"})\n` : "Final Wager: n/a\n"}Score: ${score}`;
    setSocialOutput(out);
    localStorage.setItem("SOCIALOUT", JSON.stringify(out));
  };

  function transpose(array: any[]) {
    return array[0].map((_: any, colIndex: string | number) => array.map((row: { [x: string]: any; }) => row[colIndex]));
  }

  const convertBoardToEmoji = (board: BoardArray) => {
    // console.log("Calculating output")
    let copyOfBoard: BoardArray = JSON.parse(JSON.stringify(board));
    let output = "";
    let b = transpose(copyOfBoard);
    // let b = board;
    let dd = "";
    b.forEach((category: any[], i: any) => {
      category.forEach((clue: {
        dailyDouble?: boolean; status: string; value: number;
      }, j: any) => {
        if (clue.status === "CORRECT") {
          output += correct_emoji;
        } else if (clue.status === "INCORRECT") {
          output += incorrect_emoji;
        } else {
          output += unanswered_emoji;
        }
        if (clue.dailyDouble === true) {
          dd += `DD: ${clue.value} (${clue.status === "CORRECT" ? "✅" : (clue.status === "INCORRECT" ? "❌" : "❓")})\n`
        }
      });
      output += `\n`
    })
    output += `${dd.length > 0 ? `${dd}\n` : ""}`

    return output;
  };

  const computeEndScreen = () => {
    setJeopardyRoundEmojiScoreboard(convertBoardToEmoji(jeopardyRoundBoard));
    setDoubleJeopardyRoundEmojiScoreboard(convertBoardToEmoji(doubleJeopardyRoundBoard));
    updateSocialOutput();
  };

  useEffect(() => {
    computeEndScreen();
  }, [score, round]);  

  return (
    <>
      <Meta title="Home" />
      <div style={{ marginBottom: "1rem" }} />
      <CenteredFlexBox>
        <Typography variant="h6">Score: {score}</Typography>
      </CenteredFlexBox>
      <div style={{ marginBottom: "1rem" }} />
      <CenteredFlexBox>
        {round === "JEOPARDY" && <>
          <Button variant="outlined" onClick={() => { advanceToDoubleJeopardy() }}>Proceed to Double Jeopardy</Button>
        </>}
        {round === "DOUBLE JEOPARDY" && <>
          <Button variant="outlined" onClick={() => { advanceToFinalJeopardy() }}>Proceed to Final Jeopardy</Button>
        </>}
        {round === "FINAL JEOPARDY" && <>
          <Button variant="contained" disabled={finalJeopardyCorrect === undefined && score > 0} onClick={() => { advanceToScore() }} color="info">Get Score</Button>
        </>}
        {round === "GAME OVER" && <>
          <Button variant="outlined" onClick={() => { resetGame() }}>New Game</Button>
        </>}
      </CenteredFlexBox>
      <div style={{ marginBottom: "1rem" }} />
      <div style={{ 
        marginLeft: "-1rem"
      }}>
        {round === "JEOPARDY" && <Board board={jeopardyRoundBoard} setBoard={setJeopardyRoundBoard} round={"JEOPARDY"} score={score} />}
        {round === "DOUBLE JEOPARDY" && <Board board={doubleJeopardyRoundBoard} setBoard={setDoubleJeopardyRoundBoard} round={"DOUBLE JEOPARDY"} score={score} />}
      </div>
      {round === "FINAL JEOPARDY" && <>
        <CenteredFlexBox flexDirection={"column"}>
          {!qualifiesForFinal ? (<>Sorry, you don't qualify for Final Jeopardy</>) : (<>
            <Typography variant="h4">
              Final Jeopardy
            </Typography>
            <TextField
              helperText="Please enter your wager"
              disabled={wagerLocked}
              id="wager"
              label="Wager"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={finalWager}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);

                if (value > score) value = score;
                if (value < 0) value = 0;
                if (isNaN(value)) value = 0;

                setFinalWager(value);
              }}
            />
            {!wagerLocked && <Button variant="contained" onClick={() => { setWagerLocked(true) }}>Lock in Wager</Button>}
            {wagerLocked && <>
              <Button onClick={() => { setWagerLocked(false) }}>Unlock Wager</Button>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem"
              }}>
                <Button disabled={finalJeopardyCorrect === false} onClick={() => { setFinalJeopardyCorrect(true) }} color="success" variant="contained" size="large">Correct</Button>
                <Button disabled={finalJeopardyCorrect === true} onClick={() => { setFinalJeopardyCorrect(false) }} color="error" variant="contained" size="large">Incorrect</Button>
              </Box>
              {finalJeopardyCorrect !== undefined && <>
                <Button onClick={() => { setFinalJeopardyCorrect(undefined) }}>Undo</Button>
              </>}
            </>}
          </>)}
        </CenteredFlexBox>
      </>}
      {round === "GAME OVER" && <>
        <CenteredFlexBox flexDirection={"column"}>
          {/* <Button onClick={computeEndScreen} variant="contained">DEBUG: RECALCULATE</Button> */}
          {!hasGeneratedOutput && <Button onClick={() => {
            // TODO: why do I have to do this? it should just generate valid output on load, but I'm doing something wrong with the state.
            computeEndScreen();
            setHasGeneratedOutput(true);
          }} variant="contained" color="info">Generate Shareable Score Report</Button>}
          <TextField sx={{ minWidth: 300, maxWidth: "100%" }} value={hasGeneratedOutput === true ? socialOutput : ""} disabled multiline />
          <Button disabled={!hasGeneratedOutput} variant="contained" onClick={() => {
            navigator.clipboard.writeText(socialOutput);
            notificationsActions.push({
              options: {
                content: (
                  <Alert severity="info">
                    <AlertTitle>Copied to clipboard!</AlertTitle>
                    Share your results on social media or in a group chat with friends!
                  </Alert>
                ),
              },
            });
          }}>Copy to Clipboard</Button>
        </CenteredFlexBox>
      </>}
    </>
  );
}

export default Home;
