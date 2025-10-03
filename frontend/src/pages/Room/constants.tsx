import type { MeetingDetailsProps } from "../../components/shared/Card";
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import { type ReactElement } from 'react';
export interface roomDetails {
    roomType: string,
    emoji: ReactElement
}

export const roomArr: roomDetails[] = [
    {
        roomType: 'public',
        emoji: <PublicIcon />
    }
    ,
    {
        roomType: 'group',
        emoji: <PeopleIcon />
    }
    ,
    {
        roomType: 'private',
        emoji: <LockIcon />
    }
    ,

]
