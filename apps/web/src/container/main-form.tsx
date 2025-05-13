"use client";

import { useEffect, useState } from "react";

export default function MainForm() {
	const [inputUrl, setInputUrl] = useState("");
	const [shortUrl, setShortUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [recentLinks, setRecentLinks] = useState<string[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem("recentShortUrls");
		if (stored) setRecentLinks(JSON.parse(stored));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setShortUrl(null);
		setLoading(true);

		try {
			const res = await fetch("/api/shorten", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: inputUrl }),
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || "Failed to shorten URL");
			}

			const { shortUrl } = await res.json();
			setShortUrl(shortUrl);
			const updated = [shortUrl, ...recentLinks].slice(0, 5);
			setRecentLinks(updated);
			localStorage.setItem("recentShortUrls", JSON.stringify(updated));
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
			<div className="w-full max-w-screen-lg mx-auto px-4 flex flex-col md:flex-row md:items-stretch md:space-x-6">
				<div className="w-full min-w-2xs md:max-w-2xl mx-auto">
					<form
						onSubmit={handleSubmit}
						className="w-full max-w-md bg-white p-6 rounded-2xl shadow"
					>
						<h1 className="text-xl font-bold mb-4">URL Shortener</h1>

						<label className="block mb-2">
							<span className="text-sm font-medium">Enter URL to shorten</span>
							<input
								type="url"
								required
								value={inputUrl}
								onChange={(e) => setInputUrl(e.target.value)}
								className="mt-1 block w-full p-2 border rounded"
								placeholder="https://example.com/long-path"
							/>
						</label>

						<button
							type="submit"
							disabled={loading}
							className="mt-4 w-full py-2 rounded bg-blue-600 text-white disabled:opacity-50"
						>
							{loading ? "Shortening…" : "Shorten URL"}
						</button>

						{error && (
							<p className="mt-3 text-red-600 text-sm">Error: {error}</p>
						)}

						{shortUrl && (
							<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
								<p className="text-sm">Your short link:</p>
								<a
									href={shortUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-700 underline break-all"
								>
									{shortUrl}
								</a>
								<button
									type="button"
									onClick={() => {
										navigator.clipboard.writeText(shortUrl);
										setCopied(true);
										setTimeout(() => setCopied(false), 2000);
									}}
									className="ml-2 text-sm text-gray-600 hover:text-gray-800"
								>
									{copied ? "Copied!" : "Copy"}
								</button>
							</div>
						)}
					</form>
				</div>
				<div className="flex-1 min-w-2xs mt-6 md:mt-0">
					{recentLinks.length > 0 && (
						<div className="mt-8 p-6 bg-white shadow-md rounded-lg border border-gray-200">
							<h2 className="text-lg font-semibold mb-4 text-gray-800">
								Recent Short Links
							</h2>
							<ul className="space-y-2">
								{recentLinks.map((link) => (
									<li key={link}>
										<a
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline break-all"
										>
											{link}
										</a>
									</li>
								))}
							</ul>
							<button
								type="button"
								onClick={() => {
									setRecentLinks([]);
									localStorage.removeItem("recentShortUrls");
								}}
								className="mt-4 text-sm text-red-600 hover:underline"
							>
								Clear Recent
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
