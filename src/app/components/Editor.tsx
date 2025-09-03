/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { useDocument } from "../hooks/useDocument";
import AuthContext from "./AuthContext";
import QuillEditor from "./QuillEditor";
import Quill, { Range } from "quill";
import DeltaQuill from "quill-delta";

// Quill's Delta is a class, so we can use `InstanceType<typeof Delta>`
const Delta = Quill.import("delta") as { new (): any };

export default function Editor({ dbContent }: { dbContent: string }) {
	const { user } = useContext(AuthContext);
	const [range, setRange] = useState<Range | null>(null);
	const [lastChange, setLastChange] = useState<any>(null);
	const { channel } = useChannelStateContext();
	const userID = user?.uid as string;
	const { updateDocument } = useDocument();
	const quillRef = useRef<Quill | null>(null);

	// Refs for Stream + user identity
	const channelRef = useRef(channel);
	const userIDRef = useRef(userID);

	// Buffers + timers
	const deltaBufferRef = useRef<DeltaQuill[]>([]);
	const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const snapshotTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Keep refs up to date
	useEffect(() => {
		channelRef.current = channel;
		userIDRef.current = userID;
	}, [channel, userID]);

	/**
	 * 1. Capture local edits → batch into deltaBuffer
	 */
	useEffect(() => {
		const quill = quillRef.current;
		if (!quill) return;

		const handleLocalChange = (
			delta: DeltaQuill,
			old: DeltaQuill,
			source: string
		) => {
			if (source !== "user") return;

			// Accumulate delta in buffer
			deltaBufferRef.current.push(delta);

			// Schedule flush if not already scheduled
			if (!flushTimeoutRef.current) {
				flushTimeoutRef.current = setTimeout(() => {
					if (!channelRef.current) return;
					if (deltaBufferRef.current.length === 0) return;

					// Merge buffered deltas
					const batchedDelta = deltaBufferRef.current.reduce(
						(acc, d) => acc.compose(d),
						new Delta()
					);

					// Send batched delta event

					channelRef.current.sendEvent({
						// @ts-expect-error custom Stream events
						type: "text-delta",
						payload: {
							delta: batchedDelta,
							user_id: userIDRef.current,
						},
					});
					const content = quillRef.current?.getSemanticHTML();
					//👇🏻 content to context
					updateDocument({ content });

					deltaBufferRef.current = [];
					flushTimeoutRef.current = null;
				}, 1000); // flush every ~1000ms
			}

			// Also schedule a periodic snapshot (full doc) every 3s
			if (!snapshotTimeoutRef.current) {
				snapshotTimeoutRef.current = setTimeout(() => {
					if (!channelRef.current) return;
					if (!quillRef.current) return;

					channelRef.current.sendEvent({
						// @ts-expect-error custom Stream events
						type: "text-snapshot",
						payload: {
							delta: quillRef.current.getContents(),
							user_id: userIDRef.current,
						},
					});

					snapshotTimeoutRef.current = null;
				}, 3000);
			}
		};

		quill.on("text-change", handleLocalChange);

		return () => {
			quill.off("text-change", handleLocalChange);
			if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current);
			if (snapshotTimeoutRef.current) clearTimeout(snapshotTimeoutRef.current);
		};
	}, [updateDocument]);

	/**
	 * 2. Apply remote edits
	 */
	useEffect(() => {
		if (!channel) return;

		const handleDelta = (event: any) => {
			if (event.payload.user_id === userID) return;
			const incomingDelta = new DeltaQuill(event.payload.delta);

			// Apply delta directly (smoother than replacing doc)
			quillRef.current?.updateContents(incomingDelta, "api");
		};

		const handleSnapshot = (event: any) => {
			if (event.payload.user_id === userID) return;
			const incomingDelta = new DeltaQuill(event.payload.delta);
			const currentDelta = quillRef.current?.getContents();

			// Replace only if doc actually differs
			if (currentDelta && currentDelta.diff(incomingDelta).ops.length > 0) {
				quillRef.current?.setContents(incomingDelta, "api");
			}
		};

		// @ts-expect-error custom Stream events
		channel.on("text-delta", handleDelta);
		// @ts-expect-error custom Stream events
		channel.on("text-snapshot", handleSnapshot);

		return () => {
			// @ts-expect-error custom Stream events
			channel.off("text-delta", handleDelta);
			// @ts-expect-error custom Stream events
			channel.off("text-snapshot", handleSnapshot);
		};
	}, [channel, userID]);

	const content =
		dbContent ||
		"<h1>Welcome</h1><p>Start <strong>writing</strong> <u>content</u></p><p></p>";

	return (
		<div>
			<QuillEditor
				ref={quillRef}
				readOnly={true}
				defaultValue={content}
				onSelectionChange={setRange}
				onTextChange={setLastChange}
			/>

			<div className='controls flex items-center justify-end'>
				<p className='text-sm text-blue-300'>
					Character Count: {quillRef.current?.getText().length || 0}
				</p>
			</div>
		</div>
	);
}