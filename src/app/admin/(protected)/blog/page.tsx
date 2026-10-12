import Link from 'next/link';
import { Plus } from 'lucide-react';

import { PublishBadge } from '@/components/admin/status-badge';
import { AdminPageHeader } from '@/components/admin/page-header';
import { ButtonLink } from '@/components/shared/button-link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllBlogPosts } from '@/repositories/content-repository';
import { formatDate } from '@/utils/format';

export default async function AdminBlogPage() {
  const admin = await requireAdminPage();
  const posts = await listAllBlogPosts(admin.client);

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Guides and tips for visitors. Published articles appear on the blog."
        actions={
          <ButtonLink href={`${ROUTES.admin.blog}/new`}>
            <Plus className="size-4" aria-hidden="true" />
            New article
          </ButtonLink>
        }
      />

      <Card>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No articles yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Published</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link
                        href={`${ROUTES.admin.blog}/${post.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {post.published_at ? formatDate(post.published_at) : 'Not yet'}
                    </TableCell>
                    <TableCell>
                      <PublishBadge isPublished={post.is_published} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
