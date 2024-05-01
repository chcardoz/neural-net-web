"use client";

import Image from "next/image";

const MonkeyPage: React.FC = () => {
	return (
		<div>
			<h1>what you actually are:</h1>
			<h1 className="font-size-large">🐒</h1>
			<Image
				src="/monkey.jpeg"
				alt="Monkey"
				width={500}
				height={500}
			/>
		</div>
	);
};

export default MonkeyPage;
