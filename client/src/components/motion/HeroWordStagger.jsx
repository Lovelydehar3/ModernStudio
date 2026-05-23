import { useMemo, useRef } from "react";
import clsx from "clsx";
import useHeroWordStagger from "../../hooks/useHeroWordStagger";

function HeroWordStagger({ text, as = "h1", className = "" }) {
  const containerRef = useRef(null);
  const Tag = as;
  const words = useMemo(() => text.split(" "), [text]);

  useHeroWordStagger(containerRef, [text]);

  return (
    <Tag ref={containerRef} className={clsx("leading-[0.96] tracking-tight", className)}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          data-word
          className="mr-[0.22em] inline-block opacity-0"
          style={{ transform: "translateY(40px)" }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}

export default HeroWordStagger;
