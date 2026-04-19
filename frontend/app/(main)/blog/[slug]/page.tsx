import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data';

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

const categoryColors: Record<string, string> = {
  tips: 'bg-green-900/40 text-green-400',
  guides: 'bg-blue-900/40 text-blue-400',
  news: 'bg-yellow-900/40 text-yellow-400',
  local: 'bg-purple-900/40 text-purple-400',
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const otherRelated = blogPosts.filter((p) => p.slug !== post.slug && !related.includes(p)).slice(0, 2 - related.length);
  const relatedPosts = [...related, ...otherRelated].slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[360px] flex items-end pb-12 pt-24 overflow-hidden">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link href="/blog" className="flex items-center gap-1 text-text-muted hover:text-primary text-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <span className={`text-xs font-mono px-3 py-1 rounded-full capitalize mb-3 inline-block ${categoryColors[post.category]}`}>
              {post.category}
            </span>
            <h1 className="font-heading text-3xl md:text-5xl text-white leading-tight">{post.title}</h1>
          </div>
        </section>

        {/* Meta */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4 items-center text-text-muted text-sm">
            <span>By <span className="text-white">{post.author}</span></span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-text-muted text-base leading-8 space-y-5">
            {post.content.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.endsWith('**')) {
                return <h2 key={i} className="font-heading text-2xl text-white mt-10 mb-2">{para.replace(/\*\*/g, '')}</h2>;
              }
              const rendered = para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
              return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-surface border border-border text-text-muted text-xs px-3 py-1 rounded-full capitalize">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* CTA Sidebar-style Banner */}
        <section className="bg-primary py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl text-white">Ready to put these tips to use?</h3>
              <p className="text-white/80 text-sm mt-1">Get your free quote and let our crew handle the heavy lifting.</p>
            </div>
            <Link href="/quote" className="bg-white text-primary hover:bg-gray-100 font-heading tracking-wider uppercase px-8 py-3 rounded-sm transition-colors shrink-0">
              Get Free Quote
            </Link>
          </div>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="section-pad bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-3xl text-white mb-8">MORE FROM THE BLOG</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block bg-bg border border-border rounded-xl overflow-hidden card-hover">
                    <div className="relative h-40 overflow-hidden">
                      <Image src={rp.image} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg text-white mb-2 group-hover:text-primary transition-colors">{rp.title}</h3>
                      <div className="flex items-center gap-1 text-text-muted text-xs">
                        <Clock size={12} /> {rp.readTime} min read
                        <span className="ml-auto flex items-center gap-1 text-primary">Read <ArrowRight size={12} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
