"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  lines: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypeWriter({
  lines,
  typingSpeed = 55,
  deletingSpeed = 30,
  pauseDuration = 2200,
  className = "",
}: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = lines[lineIndex];

    if (!isDeleting) {
      // typing
      if (text.length < current.length) {
        return typingSpeed;
      }
      // done typing — pause then start deleting
      setIsDeleting(true);
      return pauseDuration;
    }

    // deleting
    if (text.length > 0) {
      return deletingSpeed;
    }
    // done deleting — move to next line
    setIsDeleting(false);
    setLineIndex((p) => (p + 1) % lines.length);
    return 300;
  }, [text, isDeleting, lineIndex, lines, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    const current = lines[lineIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setLineIndex((p) => (p + 1) % lines.length);
        }
      }
    }, !isDeleting && text.length === lines[lineIndex].length ? pauseDuration :
       !isDeleting ? typingSpeed :
       text.length === 0 ? 300 : deletingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, lineIndex, lines, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {text}
      <span
        className="typewriter-cursor"
        style={{
          display: "inline-block",
          width: "3px",
          height: "1em",
          background: "var(--accent)",
          marginInlineStart: "4px",
          verticalAlign: "text-bottom",
          borderRadius: 2,
        }}
      />
    </span>
  );
}
