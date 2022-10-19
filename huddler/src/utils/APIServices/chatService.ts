export const getMsgsFromHuddle = async (huddleId: number | undefined) => {
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_AWS_URL}messages?huddle-id=${huddleId}`
    );
    const res = await data.json();
    return res;
  } catch (error) {
    console.log('error getting chat messages', error);
  }
};


