import { useEffect, useRef } from 'react';

export function useReveal(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if(!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return ref;
}
