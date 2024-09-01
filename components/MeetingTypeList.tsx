'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { Call } from "@stream-io/node-sdk";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";

import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";

const MeetingTypeList = () => {
	const router = useRouter();
	const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
	const { user } = useUser();
	const client = useStreamVideoClient();
	const [values, setValues] = useState({
		dateTime: new Date(),
		description: '',
		link: '',
	});
	const [callDetails, setCallDetails] = useState<Call>();
	const { toast } = useToast();

	const createMeeting = async () => {
		if (!client || !user) return;

		try {
			if (!values.dateTime) {
				toast({
					title: "Please select a date and time!",
				});

				return;
			}

			const id = crypto.randomUUID();
			const call = client.call('default', id);

			if (!call) {
				throw new Error('Failed to create call');
			}

			const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
			const description = values.description || 'Instant meeting';

			await call.getOrCreate({
				data: {
					starts_at: startAt,
					custom: {
						description,
					}
				}
			});

			// @ts-ignore
			setCallDetails(call);

			if (!values.description) {
				router.push(`/meeting/${call.id}`);
			}

			toast({ title: "Meeting created!" });
		} catch (err) {
			console.log(err);
			toast({ title: "Failed to create meeting!" });
		}
	};

	return (
		<section className='grid grid-cols-1 gap-5 md:grid-cols-1 xl:grid-cols-4'>
			<HomeCard
				img='/icons/add-meeting.svg'
				title='New meeting'
				description='Start an instant meeting'
				className='bg-orange-1'
				handleClick={() => setMeetingState('isInstantMeeting')}
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

			<MeetingModal
				isOpen={meetingState === 'isInstantMeeting'}
				title='Start an Instant Meeting'
				className='text-center'
				buttonText='Start Meeting'
				onClose={() => setMeetingState(undefined)}
				handleClick={createMeeting}
			/>
		</section>
	);
};

export default MeetingTypeList;
