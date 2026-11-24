import { NextResponse } from 'next/server'
import { findCategories } from '@/lib/data'

export async function GET() {
  const cats = await findCategories()
  return NextResponse.json(cats)
}
