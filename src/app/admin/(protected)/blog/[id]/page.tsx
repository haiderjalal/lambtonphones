import { notFound } from 'next/navigation';

import { BlogPostForm } from '@/components/admin/blog-post-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getBlogPostById } from '@/repositories/content-repository';
import { getMediaUrl } from '@/lib/supabase/media';

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const post = await getBlogPostById(admin.client, id);

  if (!post) notFound();

  return (
    <>
      <AdminPageHeader title={post.title} description="Edit this article." />
      <BlogPostForm post={post} savedCoverUrl={getMediaUrl(post.cover_image_path)} />
    </>
  );
}
