
// Uses https://github.com/snd/url-pattern for URL matching
// and parameter extraction.
export default {
    "/login": { title: "Login" },
    "/signup": { title: "Sign Up" },
    // You can also define nested route objects!
    // Just make sure each route key starts with a slash.
    "/": {
        "title": "Home",
        "/dashboard": {
            "title": "AST Dashboard",
            "auth": true,
            "/clients": { title: "Client Management", auth: true },
            "/client": {
                "title": "Client Management",
                "auth": true,
                "/:clientId": {
                    "title": "Details for:",
                    "auth": true,
                    "/phrases": { title: "Phrases", auth: true }
                }
            },
            "/account": { title: "Account Management", auth: true },
        },
        "/subscription": {
            title: "Subscription",
            auth: false
        },
        "/bio": {
            "title": "Biographies",
            "/:name": {
                title: "Biography for:"
            }
        }
    }
};
