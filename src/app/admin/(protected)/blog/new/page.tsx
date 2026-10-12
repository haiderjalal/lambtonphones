import { BlogPostForm } from '@/components/admin/blog-post-form';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function NewBlogPostPage() {
  return (
    <>
      <AdminPageHeader title="New article" description="Write a guide or tip for visitors." />
      <BlogPostForm post={null} savedCoverUrl={null} />
    </>
  );
}
