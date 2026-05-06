const BITLY_API_URL = "https://api-ssl.bitly.com/v4/shorten";

type BitlyResponse = {
  link?: string;
  message?: string;
  description?: string;
};

export async function POST(request: Request) {
  const { longUrl } = (await request.json()) as { longUrl?: string };
  const accessToken = process.env.BITLY_ACCESS_TOKEN;

  if (!longUrl) {
    return Response.json({ error: "A URL is required." }, { status: 400 });
  }

  if (!accessToken) {
    return Response.json(
      { error: "Bitly access token is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const bitlyResponse = await fetch(BITLY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: longUrl,
      }),
    });

    const data = (await bitlyResponse.json()) as BitlyResponse;

    if (!bitlyResponse.ok || !data.link) {
      return Response.json(
        {
          error:
            data.description ??
            data.message ??
            "Bitly could not shorten that URL.",
        },
        { status: bitlyResponse.status || 502 },
      );
    }

    return Response.json({ shortUrl: data.link });
  } catch {
    return Response.json(
      { error: "Unable to reach Bitly right now. Please try again." },
      { status: 502 },
    );
  }
}
