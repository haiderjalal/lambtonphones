'use server';

import { CACHE_TAGS } from '@/constants/cache';
import {
  getBlogPostById,
  saveBlogPost,
  saveFaq,
  savePage,
} from '@/repositories/content-repository';
import { saveCategory } from '@/repositories/category-repository';
import { saveProduct } from '@/repositories/product-repository';
import { listAllServices, saveService } from '@/repositories/service-repository';
import { updateSiteSettings } from '@/repositories/settings-repository';
import {
  blogPostSchema,
  categorySchema,
  contentPageSchema,
  faqSchema,
  productSchema,
  serviceSchema,
  siteSettingsSchema,
  type BlogPostInput,
  type CategoryInput,
  type ContentPageInput,
  type FaqInput,
  type ProductInput,
  type ServiceInput,
  type SiteSettingsInput,
} from '@/lib/validations/content';
import { BusinessRuleError, runAdminMutation } from '@/services/admin-mutation';
import type { ActionResult } from '@/types/action-result';

// One exported action per admin form. Each delegates to runAdminMutation, which handles
// validation, authorisation, cache invalidation and logging.

export async function saveProductAction(
  input: ProductInput,
  recordId: string | null,
): Promise<ActionResult<{ id: string }>> {
  return runAdminMutation({
    name: 'products.save',
    schema: productSchema,
    input,
    recordId,
    successMessage: recordId ? 'Product updated.' : 'Product created.',
    invalidates: [CACHE_TAGS.products, CACHE_TAGS.productCategories],
    execute: async (values, admin, id) => {
      const product = await saveProduct(admin.client, values, id);
      return { id: product.id };
    },
  });
}

export async function saveCategoryAction(
  input: CategoryInput,
  recordId: string | null,
): Promise<ActionResult<{ id: string }>> {
  return runAdminMutation({
    name: 'product_categories.save',
    schema: categorySchema,
    input,
    recordId,
    successMessage: recordId ? 'Category updated.' : 'Category created.',
    invalidates: [CACHE_TAGS.productCategories, CACHE_TAGS.products],
    execute: async (values, admin, id) => {
      const category = await saveCategory(admin.client, values, id);
      return { id: category.id };
    },
  });
}

export async function saveServiceAction(
  input: ServiceInput,
  recordId: string | null,
): Promise<ActionResult<{ id: string }>> {
  return runAdminMutation({
    name: 'services.save',
    schema: serviceSchema,
    input,
    recordId,
    successMessage: recordId ? 'Service updated.' : 'Service created.',
    invalidates: [CACHE_TAGS.services],
    execute: async (values, admin, id) => {
      // Two-level hierarchy: device pages sit under a top-level service and nothing deeper.
      if (values.parentId !== null) {
        const allServices = await listAllServices(admin.client);
        const parent = allServices.find((service) => service.id === values.parentId);

        if (!parent || parent.parent_id !== null) {
          throw new BusinessRuleError('Choose a top-level service as the parent.');
        }

        if (id !== null && allServices.some((service) => service.parent_id === id)) {
          throw new BusinessRuleError(
            'This service has device pages under it, so it cannot become a device page.',
          );
        }
      }

      const service = await saveService(admin.client, values, id);
      return { id: service.id };
    },
  });
}

export async function saveBlogPostAction(
  input: BlogPostInput,
  recordId: string | null,
): Promise<ActionResult<{ id: string }>> {
  return runAdminMutation({
    name: 'blog_posts.save',
    schema: blogPostSchema,
    input,
    recordId,
    successMessage: recordId ? 'Article updated.' : 'Article created.',
    invalidates: [CACHE_TAGS.blogPosts],
    execute: async (values, admin, id) => {
      // Keep the original publish date when an article is edited, so the listing order is stable.
      const existing = id ? await getBlogPostById(admin.client, id) : null;
      const publishedAt = values.isPublished
        ? (existing?.published_at ?? new Date().toISOString())
        : null;

      const post = await saveBlogPost(admin.client, values, id, publishedAt);
      return { id: post.id };
    },
  });
}

export async function saveFaqAction(
  input: FaqInput,
  recordId: string | null,
): Promise<ActionResult<{ id: string }>> {
  return runAdminMutation({
    name: 'faqs.save',
    schema: faqSchema,
    input,
    recordId,
    successMessage: recordId ? 'Question updated.' : 'Question created.',
    invalidates: [CACHE_TAGS.faqs],
    execute: async (values, admin, id) => {
      const faq = await saveFaq(admin.client, values, id);
      return { id: faq.id };
    },
  });
}

export async function saveContentPageAction(
  input: ContentPageInput,
  recordId: string | null,
): Promise<ActionResult<{ id: string }>> {
  return runAdminMutation({
    name: 'pages.save',
    schema: contentPageSchema,
    input,
    recordId,
    successMessage: recordId ? 'Page updated.' : 'Page created.',
    invalidates: [CACHE_TAGS.pages],
    execute: async (values, admin, id) => {
      const page = await savePage(admin.client, values, id);
      return { id: page.id };
    },
  });
}

export async function saveSiteSettingsAction(
  input: SiteSettingsInput,
): Promise<ActionResult<undefined>> {
  return runAdminMutation({
    name: 'site_settings.save',
    schema: siteSettingsSchema,
    input,
    recordId: null,
    successMessage: 'Business details saved. The site is updated.',
    invalidates: [CACHE_TAGS.siteSettings],
    execute: async (values, admin) => {
      await updateSiteSettings(admin.client, values);
      return undefined;
    },
  });
}
