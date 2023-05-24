import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box } from "@mui/system";
import dayjs, { Dayjs } from "dayjs";

export type ChangeItem = string;

export type ChangelogItem = {
    version: string,
    changes: Array<ChangeItem>,
    notes?: string|JSX.Element,
    _time: Dayjs,
}

export const changelog: Array<ChangelogItem> = [
    {
        version: "1.0.0",
        _time: dayjs("2023-05-16T23:30:00-05:00"),
        changes: [],
        notes: "Initial release",
    },
].sort((a,b) => a._time.unix() + b._time.unix());