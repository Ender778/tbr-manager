import { NextRequest, NextResponse } from 'next/server'
import { searchBooksWithFallback } from '@/lib/api/google-books'
import { z } from 'zod'

const searchParamsSchema = z.object({
  q: z.string().min(1).max(500),
  maxResults: z.coerce.number().min(1).max(40).default(10),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const maxResults = searchParams.get('maxResults')

    // Validate query parameters
    const validatedParams = searchParamsSchema.parse({
      q: query,
      maxResults: maxResults || '10',
    })

    // Search for books
    const results = await searchBooksWithFallback(
      validatedParams.q,
      validatedParams.maxResults
    )

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    })
  } catch (error) {
    console.error('Book search error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    // Handle API errors
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search books',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, maxResults = 10 } = body

    // Validate request body
    const validatedParams = searchParamsSchema.parse({
      q: query,
      maxResults,
    })

    // Search for books
    const results = await searchBooksWithFallback(
      validatedParams.q,
      validatedParams.maxResults
    )

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    })
  } catch (error) {
    console.error('Book search error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    // Handle API errors
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search books',
      },
      { status: 500 }
    )
  }
}