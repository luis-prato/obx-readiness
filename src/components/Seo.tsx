import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  path?: string;
};

const Seo = ({ title, description }: SeoProps) => {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
  return null;
};

export default Seo;
