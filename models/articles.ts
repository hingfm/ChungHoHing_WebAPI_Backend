import * as db from "../helpers/database";
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';

const twitterClient = new TwitterApi({
  appKey: 'GN62cRjBay9jMbmHd340YTsMr',
  appSecret: 'qvhgfniHyAROWyVRw4DLSdogqKVNA210RmEUNCGFddwgLedjeJ',
  accessToken: '1800241572141060096-92t71Ipei26KxB11yh8WR3ng2p7RiG',
  accessSecret: 'iSimTTkmM8OwxGM0tfDpZVe4FaHcbCPHJzcL8iAidh2TT'
});

// Helper function to upload media to Twitter
async function uploadMedia(url: string) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const mediaType = response.headers['content-type']; // Extract content type from headers

  // Ensuring the media type is supported by Twitter
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mediaType)) {
      throw new Error(`Unsupported media type: ${mediaType}`);
  }

  // Upload the media to Twitter and return the media ID
  const mediaId = await twitterClient.v1.uploadMedia(Buffer.from(response.data), { type: mediaType });
  return mediaId;
}

// Function to post a message to Twitter
async function postTweet(message: string, mediaIds: string[]) {
  try {
    // Constructing the payload for the tweet
    const tweetData = {
        text: message,
        media: {
            media_ids: mediaIds  // Attach media by ID
        }
    };

    // Posting the tweet
    const tweet = await twitterClient.v2.tweet(tweetData);
    console.log('Tweet with media posted successfully:', tweet);
} catch (error) {
    console.error('Failed to post tweet with media:', error);
}
}

export const getById = async (id: any) => {
  let query = "SELECT * FROM articles WHERE ID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
};

export const getAll = async (
  limit = 10,
  page = 1,
  order: any,
  direction: any
) => {
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM articles LIMIT  ? OFFSET  ?;";
  const data = await db.run_query(query, [limit, offset]);
  return data;
};

export const getFiltered = async ({
  keywords,
  region,
}: {
  keywords?: string;
  region?: string;
}) => {
  let args: string[] = []
  let query = "SELECT * FROM articles ";
  if (keywords || region) {
    query += "WHERE "
  }
  if (keywords) {
    let likeKeywords = `%${keywords}%`
    query += "title like ? or alltext like ? or summary like ? or description like ?"
    args = args.concat([likeKeywords, likeKeywords, likeKeywords, likeKeywords])
    if (region) {
      query += "and region = ? "
      args.push(region)
    }
  } else if (region) {
    query += "region = ? "
    args.push(region)
  }
  const data = await db.run_query(query, args);
  return data;
};

export const add = async (article: any) => {
  const keys = Object.keys(article).join(',');
  const placeholders = new Array(keys.split(',').length).fill('?').join(',');
  const values = Object.values(article);
  const query = `INSERT INTO articles (${keys}) VALUES (${placeholders})`;
  try {
      await db.run_query(query, values);
      const message = `New article added. Check it out!\n\nTitle: ${article.title || 'No Title'}\nAbout: ${article.alltext || 'No details'}\nSummary: ${article.summary}\nDetail Description: ${article.description}\nRegion: ${article.region}\nBreed: ${article.kinds}`;
      const mediaId = await uploadMedia(article.imageurl);
      await postTweet(message, [mediaId]);
      return { status: 201, message: 'Article added and tweet posted with image!' };
  } catch (err) {
      console.error('Failed to add article and tweet:', err);
      return { status: 500, error: err };
  }
}

export const update = async (article: any, id: any) => {
  //console.log("article " , article)
  // console.log("id ",id)
  let keys = Object.keys(article);
  let values = Object.values(article);
  let updateString = "";
  for (let i: number = 0; i < values.length; i++) {
    updateString += keys[i] + "=" + "'" + values[i] + "'" + ",";
  }
  updateString = updateString.slice(0, -1);
  // console.log("updateString ", updateString)
  let query = `UPDATE articles SET ${updateString} WHERE ID=${id} RETURNING *;`;
  try {
    await db.run_query(query, values);
    return { status: 201 };
  } catch (error) {
    return error;
  }
};

export const deleteById = async (id: any) => {
  let query = "Delete FROM articles WHERE ID = ?";
  let values = [id];
  try {
    await db.run_query(query, values);
    return { affectedRows: 1 };
  } catch (error) {
    return error;
  }
};
