import { getPostAndMorePosts } from '@/lib/api'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const secret = searchParams.get('secret')
	const slug = searchParams.get('slug')

	if (!secret || !slug) {
		return new Response('Missing parameters', { status: 400 })
	}

	if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
		return new Response('Invalid token', { status: 401 })
	}

	const post = await getPostAndMorePosts(slug, true)

	if (!post) {
		return new Response('Post not found', { status: 404 })
	}

	;(await draftMode()).enable()
	redirect(`/posts/${slug}`)
}
