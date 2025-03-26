
export class Subdomain {
    static readonly DomainRegex = /pod-doc-svelte-(v\d+)\.vercel\.app/;

    static test(url: URL): string | null {
        const match = url.origin.match(this.DomainRegex);
        return match ? match[1] : null;
    }
}