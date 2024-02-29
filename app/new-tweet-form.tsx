'use client'
import { ChangeEvent, useState } from "react"
import Image from "next/image"

interface NewTweetFormProps {
	addTweet: (formData: FormData) => Promise<void>,
	avatarUrl: string, 
	name: string,
}

export default function NewTweetForm({ addTweet, avatarUrl, name }: NewTweetFormProps) {
	const [textareaValue, setTextareaValue] = useState('')
	const [wordCount, setWordCount] = useState(0)

	const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setTextareaValue(e.target.value)
		setWordCount(e.target.value.length)
	}

	const onSubmit = async (formData: FormData) => {
		await addTweet(formData);
		setTextareaValue('');
		setWordCount(0);
	}

	return (
		<form action={onSubmit} className="bg-main border border-border px-4 py-8 rounded-lg">
			<div className="flex">
				<div className="h-12 w-12">
					<Image 
						alt={`${name} avatar`} 
						src={avatarUrl} 
						className="rounded-full"
						height={40}
						width={40}
					/>
				</div>
				<textarea 
					name="title" 
					className="bg-inherit border-accent flex-1 ml-2 placeholder-border px-2 py-1 text-lg outline-none focus:border-b" 
					maxLength={280}
					onChange={handleTextChange}
					placeholder="What's happening?" 
					rows={3}
					value={textareaValue}
				/>
			</div>
			<div className="flex items-center justify-end mt-4 w-full">
				<div className="character-count mr-4 text-sm">
					<span className={wordCount > 260 ? 'text-red-500' : 'text-border-lighter'}>
						{wordCount} / 280
					</span>
				</div>
				<button 
					className="bg-accent border border-accent px-3.5 py-1.5 rounded-full text-main transition-all hover:bg-transparent hover:text-accent"
					type="submit"
				>
					<span className="font-semibold">Tweet</span>
				</button>
			</div>
		</form>
	)
}
