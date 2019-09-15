const ghpages = require('gh-pages');

const token = process.env.GH_TOKEN;

ghpages.publish(
  '.www',
  {
    repo: `https://${token}@github.com/Snugug/blog.git`,
    // silent: true,
    message: ':shipit: Deploy to Pages',
    user: {
      name: 'Deploy Bot',
      email: 'sam@snug.ug',
    },
  },
  err => {
    if (err) {
      console.error('FAILURE');
      const tokenRegex = new RegExp(token, 'gm');
      console.error(err.message.replace(tokenRegex, 'GH_TOKEN'));
      process.exit(2);
    }
    console.log('Deployed');
  },
);
