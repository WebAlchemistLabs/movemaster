import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data';

export const metadata: Metadata = {
  title: 'Moving Tips & Guides',
  description: 'Expert moving tips, guides, and local advice from the MoveMaster Pro team. Everything you need to know for a stress-free move.',
};

const categoryColors: Record<string, string> = {
  tips: 'bg-green-900/40 text-green-400',
  guides: 'bg-blue-900/40 text-blue-400',
  news: 'bg-yellow-900/40 text-yellow-400',
  local: 'bg-purple-900/40 text-purple-400',
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">
        <section className="pt-32 pb-16 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Knowledge Base</p>
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">MOVING TIPS & GUIDES</h1>
            <p className="text-text-muted text-lg max-w-xl mx-auto">
              Expert advice from our team of 48 professional movers. We have seen it all — and we are sharing what we know.
            </p>
          </div>
        </section>

        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured post */}
            <Link href={`/blog/${featured.slug}`} className="group block mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-surface border border-border rounded-2xl overflow-hidden card-hover">
                <div className="relative h-64 lg:h-auto min-h-[280px]">
                  <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className={`text-xs font-mono px-3 py-1 rounded-full inline-block w-fit mb-4 capitalize ${categoryColors[featured.category]}`}>
                    {featured.category}
                  </span>
                  <h2 className="font-heading text-3xl text-white mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-text-muted text-sm">
                    <span>By {featured.author}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {featured.readTime} min read</span>
                  </div>
                  <span className="text-primary flex items-center gap-1 mt-4 text-sm group-hover:gap-2 transition-all">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-surface border border-border rounded-xl overflow-hidden card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-mono px-2.5 py-1 rounded-full capitalize ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl text-white mb-2 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-text-muted text-sm line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-text-muted text-xs">
                      <span>By {post.author}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-surface border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-4xl text-white mb-4">READY TO MOVE?</h2>
            <p className="text-text-muted mb-8">Get a free quote and let Southern Ontario&apos;s best crew handle the rest.</p>
            <Link href="/quote" className="btn-primary text-lg px-10 py-4">Get Free Quote →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
