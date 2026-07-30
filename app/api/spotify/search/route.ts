import { NextRequest, NextResponse } from "next/server";

let accessToken = "";
let expiresAt = 0;

async function getAccessToken() {
  if (Date.now() < expiresAt && accessToken) {
    return accessToken;
  }
 console.log("CLIENT ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.SPOTIFY_CLIENT_SECRET?.slice(0, 8)); 

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    }
  );

 const data = await response.json();

console.log("SPOTIFY TOKEN RESPONSE:");
console.log(data);

if (!response.ok) {
  throw new Error(JSON.stringify(data));
}

accessToken = data.access_token;
expiresAt = Date.now() + data.expires_in * 1000;

return accessToken;


}

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q");

  if (!search) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }

  const token = await getAccessToken();
console.log("TOKEN:", token);
  const spotify = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      search
    )}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

const data = await spotify.json();

console.log("SEARCH RESPONSE:");
console.log(data);

if (!spotify.ok) {
  return NextResponse.json(data, { status: spotify.status });
}

return NextResponse.json(data);
}