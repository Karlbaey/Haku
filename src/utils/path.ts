import { base } from "@/config";

export function getTagPath(t: string):string {
    const p = `/tags/${t}/`

    return base ? `${base}${p}` : p
}

export function getArticlePath(slug: string): string {
    const p = `/articles/${slug}/`

    return base ? `${base}${p}` : p
}