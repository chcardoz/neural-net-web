"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const [name, setName] = useState("");
	const { push } = useRouter();
	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		push(`/prediction/${name}`);
	};

	return (
		<div>
			<div>
				<h1>Enter Your Name</h1>
			</div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Type your name..."
					value={name}
					className="text-black"
					onChange={(e) => setName(e.target.value)}
				/>
				<button type="submit">Predict Data</button>
			</form>
		</div>
	);
}
