import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "Agiriki",
	description: "Where producers and consumers meet",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}
