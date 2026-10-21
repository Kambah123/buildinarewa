import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

export async function StoryMdx({source}: {source: string}) {
  return <div className="story-mdx max-w-2xl text-[1.04rem] leading-8 text-[var(--muted)] [&_a]:font-bold [&_a]:text-[var(--indigo)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--sand)] [&_blockquote]:pl-5 [&_blockquote]:font-display [&_blockquote]:text-2xl [&_blockquote]:leading-8 [&_h1]:mt-10 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mt-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"><MDXRemote source={source} options={{mdxOptions: {remarkPlugins: [remarkGfm]}}} /></div>;
}
