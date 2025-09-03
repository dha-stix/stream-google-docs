"use client"
import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  RefObject
} from "react";
import Quill, { EmitterSource, QuillOptions, Range} from "quill";

// Define props interface
interface EditorProps {
  readOnly?: boolean;
  defaultValue?: string | object; // Quill Delta shape, but in your .d.ts it's not explicitly typed
  onTextChange?: (
    delta: object,
    oldContents: object,
    source: EmitterSource
  ) => void;
  onSelectionChange?: (
    range: Range | null,
    oldRange: Range | null,
    source: EmitterSource
  ) => void;
}

const QuillEditor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef<EditorProps["defaultValue"]>(defaultValue);
    const onTextChangeRef = useRef<EditorProps["onTextChange"]>(onTextChange);
    const onSelectionChangeRef = useRef<EditorProps["onSelectionChange"]>(
      onSelectionChange
    );

    // Keep callbacks in sync
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    }, [onTextChange, onSelectionChange]);

    // Enable/disable editor when readOnly changes
    useEffect(() => {
      if ((ref as RefObject<Quill | null>)?.current) {
        (ref as RefObject<Quill | null>).current?.enable(
          !readOnly
        );
      }
    }, [ref, readOnly]);

    // Initialize Quill
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.ownerDocument.createElement("div");
      container.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: "snow",
      } as QuillOptions);

      // Attach quill to forwarded ref
      if (typeof ref === "function") {
        ref(quill);
      } else if (ref) {
        (ref as RefObject<Quill | null>).current = quill;
      }

      // Set default value if provided
      if (defaultValueRef.current) {
        if (typeof defaultValueRef.current === "string") {
          quill.clipboard.dangerouslyPasteHTML(defaultValueRef.current);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          quill.setContents(defaultValueRef.current as any);
        }
      }

      // Event listeners
      quill.on("text-change", (delta: object, oldContents: object, source: EmitterSource) => {
        onTextChangeRef.current?.(delta, oldContents, source);
      });

      quill.on("selection-change", (range: Range | null, oldRange: Range | null, source: EmitterSource) => {
        onSelectionChangeRef.current?.(range, oldRange, source);
      });

      // Cleanup
      return () => {
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          (ref as RefObject<Quill | null>).current = null;
        }
        container.innerHTML = "";
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
