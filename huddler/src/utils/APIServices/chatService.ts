export const getMsgsFromHuddle = async (huddleId: number | undefined) => {
  try {
    const data = await fetch(
      `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/messages?huddle-id=${huddleId}`
    );
    const res = await data.json();
    return res;
  } catch (error) {
    console.log('error getting chat messages', error);
  }
};

