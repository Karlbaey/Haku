// src/content.config.ts
import { defineCollection, z } from "astro:content";
import themeConfig from "./config";

// Define a collection named 'articles'
const articles = defineCollection({
    type: 'content',
    schema: z.object({
        // required
        title: z.string(),
        published: z.date(),
        // optional
        description: z.string().optional().default(''),
        update: z.preprocess(
            val => val === '' ? undefined : val,
            z.date().optional(),
        ),
        tags: z.array(z.string()).optional().default([]),
        // advanced
        draft: z.boolean().optional().default(false),
        pin: z.number().int().min(0).max(99).optional().default(0),
        toc: z.boolean().optional().default(themeConfig.global.toc),
        abbrlink: z.string().optional().default('').refine(
            abbrlink => !abbrlink || /^[a-z0-9\-]*$/.test(abbrlink),
            { message: 'Abbrlink can only contain lowercase letters, numbers and hyphens' }
        ),
    }),
})

const main_page = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        subtitle: z.string(),
    })
})


export const collections = { articles, main_page }