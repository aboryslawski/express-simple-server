const axios = require('axios');
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3300;

server.use(express.static('public'));

server.get('/', async (_req, res) => {
  try {
    const response = await axios.get('https://hpjmztojsgsfbln7ibyhxzt2s.js.wpenginepoweredstaging.com/');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching home URL:', error.message);
    res.status(500).send('Error fetching content from home URL');
  }
});

server.get('/fetch-wordpress-graphql', async (_req, res) => {
  const query = `
    query QueryPosts {
      posts {
        nodes {
          id
          content
          title
          slug
          featuredImage {
            node {
              mediaDetails {
                sizes {
                  sourceUrl
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(process.env.GRAPHQL_API_URL, { query });
  res.send(response.data.data.posts.nodes);
});

server.get('/envs', (req, res) => {
  console.log('hello!!');
  console.log(process.env);
  res.send('Envs displayed in logs!');
});

server.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});
