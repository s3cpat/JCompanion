import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { FlexBox } from '@/components/styled';
import { Container } from '@mui/system';

function About() {
  return (
    <>
      <Meta title="About" />
      <FullSizeCenteredFlexBox flexDirection={"column"}>
        <FlexBox>
          <Container>
            <Typography variant="h3">I'll take "About", for 200</Typography>
          </Container>
        </FlexBox>
        <div style={{ marginBottom: "2rem" }} />
        <FlexBox>
          <Typography variant="h4">Here is the clue:</Typography>
        </FlexBox>
        <div style={{ marginBottom: "2rem" }} />
        <Container fixed>
          <FlexBox flexDirection={"column"}>
            <Typography variant="body1" gutterBottom>
              This app is a Jeopardy fan hobby project born from the desire to play along while watching Jeopardy. Whether viewers like to shout out their responses at the television before the contestants verbalize an answer or follow along silently, this app helps them keep track of their personal "score", if they had been a contestant on Jeopardy.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Score is kept via the honor system.
            </Typography>
          </FlexBox>
        </Container>
        <div style={{ marginBottom: "2rem" }} />
        <FlexBox>
          <Container>
            <Typography variant="h4">What is "JCompanion"?</Typography>
          </Container>
        </FlexBox>
        <div style={{ marginBottom: "2rem" }} />
        <FlexBox>
          <Container>
            <Typography variant="h4">That is correct.</Typography>
          </Container>
        </FlexBox>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default About;
