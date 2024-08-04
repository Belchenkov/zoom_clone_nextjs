'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';

import HomeCard from "@/components/HomeCard";

const MeetingTypeList = () => {
	const router = useRouter();
	const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

	return (
		<section className='grid grid-cols-1 gap-5 md:grid-cols-1 xl:grid-cols-4'>
			<HomeCard
				img='/icons/add-meeting.svg'
				title='New meeting'
				description='Start an instant meeting'
				className='bg-orange-1'
				handleClick={() => setMeetingState('isJoiningMeeting')}
			/>
			<HomeCard
				img='/icons/schedule.svg'
				title='Schedule meeting'
				description='Plan your meeting'
				className='bg-blue-1'
				handleClick={() => setMeetingState('isScheduleMeeting')}
			/>
			<HomeCard
				img='/icons/recordings.svg'
				title='View Recordings'
				description='Check out your recordings'
				className='bg-purple-1'
				handleClick={() => router.push('/recordings')}
			/>
			<HomeCard
				img='/icons/join-meeting.svg'
				title='Join meeting'
				description='Via invitation link'
				className='bg-yellow-1'
				handleClick={() => setMeetingState('isJoiningMeeting')}
			/>
		</section>
	);
};

export default MeetingTypeList;
