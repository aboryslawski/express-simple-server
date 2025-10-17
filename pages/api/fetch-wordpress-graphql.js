import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

  try {
    const response = await axios.post(process.env.GRAPHQL_API_URL, { query });
    res.status(200).json(response.data.data.posts.nodes);
  } catch (error) {
    console.error('Error fetching GraphQL data:', error.message);
    res.status(500).json({ error: 'Error fetching GraphQL data' });
  }
}