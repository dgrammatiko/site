const ghpages = require('gh-pages');

const token = process.env.GH_TOKEN;

ghpages.publish(
  '.www',
  {
    repo: `https://${token}@github.com/dgrammatiko/dgrammatiko.online.git`,
    // silent: true,
    message: ':shipit: Deploy to Pages',
    user: {
      name: 'Deploy Bot',
      email: 'd.grammatiko@gmail.com',
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
