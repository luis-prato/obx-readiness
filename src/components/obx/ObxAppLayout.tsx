import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ObxAppIcon, { type ObxAppKind } from '@/components/obx/ObxAppIcon';

export type ObxStep = {
  title: string;
  detail: string;
};

export type ObxFaq = {
  question: string;
  answer: string;
};

type ObxAppLayoutProps = {
  appName: string;
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
  kind: ObxAppKind;
  contentId?: string;
  steps: ObxStep[];
  faqs: ObxFaq[];
  children: ReactNode;
};

const ObxAppLayout = ({
  appName,
  title,
  intro,
  seoTitle,
  seoDescription,
  path,
  kind,
  contentId = 'app-content',
  steps,
  faqs,
  children,
}: ObxAppLayoutProps) => {
  const startId = 'how-it-works';

  const startApp = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const content = document.getElementById(startId);
    if (!content) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    content.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    content.focus({ preventScroll: true });
    window.history.replaceState(null, '', `#${startId}`);
  };

  return (
  <main className="min-h-screen bg-background text-foreground">
    <Seo title={seoTitle} description={seoDescription} path={path} />
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6 md:px-12 lg:px-16">
        <Link to="/" className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-60">
          <ObxAppIcon kind={kind} className="h-7 w-7 shrink-0" />
          <span className="truncate font-sans text-sm font-semibold md:text-base">OBX — {appName}</span>
        </Link>
        <Button asChild size="sm">
          <a href={`#${startId}`} onClick={startApp}>Get started</a>
        </Button>
      </div>
    </header>

    <section className="flex min-h-[78vh] items-center justify-center px-6 pb-20 pt-32 text-center md:px-12 md:pb-24 md:pt-40 lg:px-16">
      <AnimatedSection>
        <p className="mx-auto mb-7 w-fit rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Outcome-Based X
        </p>
        <h1 className="mx-auto max-w-5xl font-serif text-4xl font-normal leading-[1.05] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </p>
        <Button asChild size="lg" className="mt-9">
          <a href={`#${startId}`} onClick={startApp}>
            Get started <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </Button>
      </AnimatedSection>
    </section>

    <section id={startId} tabIndex={-1} className="scroll-mt-20 px-6 pb-20 outline-none md:px-12 md:pb-24 lg:px-16">
      <AnimatedSection>
        <h2 className="text-center font-sans text-3xl font-semibold md:text-4xl">How it works</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-md border border-border bg-card p-7 md:p-8">
              <h3 className="font-sans text-lg font-semibold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
      </AnimatedSection>
    </section>

    <div id={contentId} tabIndex={-1} className="scroll-mt-20 outline-none">
      {children}
    </div>

    <section className="px-6 pb-24 pt-4 md:px-12 md:pb-32 md:pt-8 lg:px-16">
      <AnimatedSection>
        <h2 className="text-center font-sans text-3xl font-semibold md:text-4xl">Frequently asked</h2>
        <div className="mx-auto mt-10 max-w-6xl rounded-md border border-border bg-card px-5 md:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-6 text-left font-sans text-sm font-semibold hover:no-underline md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-6 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </AnimatedSection>
    </section>

    <Footer />
  </main>
  );
};

export default ObxAppLayout;
