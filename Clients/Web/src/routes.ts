
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
            "title": "My Community Dashboard",
            "auth": true,
            "/post": {
                "title": "My Community Management",
                "auth": true,
                "/:postId": {
                    title: "Details for:",
                    auth: true
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
