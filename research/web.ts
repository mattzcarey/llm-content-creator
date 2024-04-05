export const searchWeb = async (searchTerm: string): Promise<any> => {
  const url = `https://serpapi.com/search.json?q=${searchTerm}&api_key=${process.env.SERP_API_KEY}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
