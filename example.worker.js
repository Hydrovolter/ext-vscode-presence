export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const key = "workspace_data";

        if (request.method === "POST") {
            const data = await request.json();
            await env.KV_NAMESPACE.put(key, JSON.stringify(data));
            return new Response("Data stored successfully", { status: 200 });
        }
        
        if (request.method === "GET") {
            const data = await env.KV_NAMESPACE.get(key);
            return new Response(data || "{}", { status: 200, headers: { "Content-Type": "application/json" } });
        }

        return new Response("Method Not Allowed", { status: 405 });
    }
};
