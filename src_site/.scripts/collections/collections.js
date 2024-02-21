export default {
  blogs: (collection) => collection.getFilteredByGlob(['src_site/blog/*.md']),
  code: (collection) => collection.getFilteredByGlob(['src_site/code/*.md']),
  tagList: (collection) => {
    const tagSet = new Set();
    for (const item of collection.getAll()) {
      if ('tags' in item.data) {
        let tags = item.data.tags;

        tags = tags.filter((item) => {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case 'all':
            case 'nav':
            case 'post':
            case 'blog':
            case 'joomla':
            case 'posts':
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    };

    return [...tagSet];
  },
};
