import { ChangeItem, ChangelogItem, changelog } from '@/changelog'
import Meta from '@/components/Meta'
import { CenteredFlexBox } from '@/components/styled'
import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React from 'react'
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

function Changelog() {
  return (
    <>
      <Meta title="Home" />
      <div style={{ marginBottom: "1rem" }} />
      <CenteredFlexBox
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography variant="h3">JCompanion Changelog</Typography>
      </CenteredFlexBox>
      <Container>
      <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          {changelog.map((change: ChangelogItem, changeIdx: number) => {
            return (
              <Box
                key={`change-${changeIdx}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "2rem"
                }}
              >
                <Typography variant="h4">v{change.version}{changeIdx === 0 && " (latest)"}</Typography>
                <Tooltip title={change._time.format("YYYY-MM-DD")} placement="bottom">
                    <Typography variant="caption">{change._time.fromNow()}</Typography>
                </Tooltip>
                <ul>
                {change.changes.map((eachChange: ChangeItem, eachChangeIdx: number) => {
                  return (
                    <li key={`change-item-${eachChangeIdx}`}>
                      <Typography variant="body1" gutterBottom>{eachChange}</Typography>
                    </li>
                  )
                })}
                </ul>
                {change.notes && <>
                  <Typography variant="h6">Notes</Typography>
                  <Typography variant="body1" gutterBottom>{change.notes}</Typography>
                </>}
                <hr style={{ width: "100%" }} />
              </Box>
            )
          })}
        </Box>
      </Container>
    </>
  )
}

export default Changelog