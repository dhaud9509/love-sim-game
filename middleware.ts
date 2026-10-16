export const config = {
  matcher: '/',
}

const SCORE_PARAMS = ['inc', 'sp', 're', 'st', 'ins']

function replaceMetaContent(html: string, selectorAttr: string, selectorValue: string, newContent: string): string {
  const pattern = new RegExp(
    `(<meta[^>]*${selectorAttr}="${selectorValue}"[^>]*content=")[^"]*(")`,
  )
  return html.replace(pattern, `$1${newContent}$2`)
}

export default async function middleware(request: Request) {
  try {
    const url = new URL(request.url)
    const hasScores = SCORE_PARAMS.some((param) => url.searchParams.has(param))
    if (!hasScores) return

    const ogParams = new URLSearchParams()
    for (const param of SCORE_PARAMS) {
      const value = url.searchParams.get(param)
      if (value !== null) ogParams.set(param, value)
    }
    const ogImageUrl = `${url.origin}/api/og?${ogParams.toString()}`

    const response = await fetch(new URL('/index.html', request.url))
    if (!response.ok) return

    let html = await response.text()
    html = replaceMetaContent(html, 'property', 'og:image', ogImageUrl)
    html = replaceMetaContent(html, 'name', 'twitter:image', ogImageUrl)
    html = replaceMetaContent(html, 'property', 'og:url', url.toString())

    return new Response(html, {
      status: response.status,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    console.error('og middleware failed:', err)
    return
  }
}
