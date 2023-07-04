## Security

- Do you need to configure CORS for your setup?
We did not need to configure any CORS headers for our setup. When looking at the response headers, they were set by default to "Access-Control-Allow-Origin: *"

- Describe how you configured a CSP for your project
Unsere CSP ist wiefolgt definiert:
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self' cdn.example.com; connect-src xcwxpqdymboeuchzyzbh.supabase.co localhost:3000;" />

Wir haben also einen html meta tag verwendet, um alle nötigen Einstellungen zu treffen. Vorherzuheben ist hier vor allem die connect-src, die auf unsere supabase api zeigt und auf localhost:3000 für lokales development

- Describe if/how your Database-Layer is vunerable to SQL Injection, what you need to avoid to be safe
- Describe if/how your View-Layer is vunerable to XSS, what you need to avoid to be safe