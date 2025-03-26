
export class Subdomain {
    static readonly DomainVercelRegex = /^https?:\/\/pod-doc-svelte-(v\d+)\.vercel\.app/;

    static test(url: URL): string | null {
        const match = url.origin.match(this.DomainVercelRegex);
        return match ? match[1] : null;
    }
}