import { useRef } from "react";
import useFadeUpReveal from "../../hooks/useFadeUpReveal";

function FadeUpReveal({ className = "", children }) {
  const ref = useRef(null);
  useFadeUpReveal(ref, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default FadeUpReveal;
