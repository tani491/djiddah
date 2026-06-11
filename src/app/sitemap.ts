import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://djiddah.store'

  // Les routes principales de ton site
  const routes = ['', '/admin', '/reparation', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8, // Priorité max pour la page d'accueil
  }))

  return [...routes]
}