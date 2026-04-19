if (navigator.modelContext) {
  navigator.modelContext
    .provideContext()
    .then((ctx) => {
      const tools = [
        {
          name: 'view_about',
          description: 'Learn about Dimitris Grammatikogiannis, the site owner',
          inputSchema: { type: 'object', properties: {} },
          execute: async () => {
            window.location.href = '/about/';
          },
        },
        {
          name: 'view_blog',
          description: 'Browse the blog posts',
          inputSchema: { type: 'object', properties: {} },
          execute: async () => {
            window.location.href = '/blog/';
          },
        },
        {
          name: 'view_code',
          description: 'View code projects and experiments',
          inputSchema: { type: 'object', properties: {} },
          execute: async () => {
            window.location.href = '/code/';
          },
        },
      ];
      ctx.registerTools(tools);
    })
    .catch(() => {});
}
