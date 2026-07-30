"use client";
import "./create.css";
import { useState } from "react"; 
import { supabase } from "../lib/supabase";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("Chill");
  const [songs, setSongs] = useState([
  { title: "", artist: "", favorite: false },
]);
const [savedMixtapes, setSavedMixtapes] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");
const searchSpotify = async () => {
  if (!search) return;

  setLoading(true);

  const response = await fetch(
    `/api/spotify/search?q=${encodeURIComponent(search)}`
  );

  const data = await response.json();

  setResults(data.tracks.items);
  setLoading(false);
};
async function saveToSupabase() {
  const { data, error } = await supabase.from("mixtapes").insert([
    {
      title,
      mood,
      songs,
    },
  ]);

  console.log("Supabase response:", { data, error });

if (error) {
  alert(JSON.stringify(error, null, 2));
} else {
  alert("Mixtape saved successfully!");
}
}
async function loadMixtapes() {
  const { data, error } = await supabase
    .from("mixtapes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(JSON.stringify(error, null, 2));
    return;
  }

  setSavedMixtapes(data || []);
}   
  return (
    <main className="mixtape-container">
      <div className="mixtape-card"> 
<h1 className="mixtape-title">
  🎵 Mixtape Creator
</h1>
<div className="cassette">
  <span className="sticker flower">🌼</span>

  <div className="tape">
   <div className="tape-label">
  <span>MY MIXTAPE</span>
</div>

    <div className="reel left">
      <div className="hole"></div>
    </div>

    <div className="reel right">
      <div className="hole"></div>
    </div>
  </div>

  <span className="sticker star">⭐</span>
  </div>
<div className="search-row">
<input
  type="text"
  placeholder="Search Spotify..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}

/>

<button
  className="blue-btn"
  onClick={searchSpotify}
>
  Search Spotify
</button>
</div>
{loading && <p>Searching...</p>}


{results.map((track: any) => (
  <div key={track.id} className="spotify-card">
    <img
      className="album-cover"
      src={track.album.images[1]?.url}
      alt={track.name}
    />

    <div className="spotify-info">
      <h4>{track.name}</h4>
      <p>{track.artists[0].name}</p>
    </div>

    <button
    className="add-btn"
      onClick={() =>
        setSongs([
          ...songs,
          {
            title: track.name,
            artist: track.artists[0].name,
            favorite: false,
          },
        ])
      }
    >
      +
    </button>
  </div>
))}
        <p>Title</p>

        <input
  type="text"
  placeholder="Enter mixtape title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
        <p>Mood</p>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          
        >
          <option>Chill</option>
          <option>Happy</option>
          <option>Sad</option>
          <option>Party</option>
          <option>Romantic</option>
        </select>

        <h3 className="section-title">🎵 Songs</h3>
        {songs
  .filter(
  (song) =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
)
  .map((song, index) => (
  <div key={index} style={{ marginBottom: "15px" }}>
   <div className="song-row">
    <input
    type="text"
      placeholder="Song Title"
      value={song.title}
      onChange={(e) => {
        const updated = [...songs];
        updated[index].title = e.target.value;
        setSongs(updated);
      }}
      />
    <input
      type="text"
      placeholder="Artist"
      value={song.artist}
      onChange={(e) => {
        const updated = [...songs];
        updated[index].artist = e.target.value;
        setSongs(updated);
      }}
      
    />
</div>
    <button
  onClick={() => {
    const updated = [...songs];
    updated[index].favorite = !updated[index].favorite;
    setSongs(updated);
  }}
  
>
  {song.favorite ? "⭐" : "☆"}
</button>
    <button
    className="small-delete"
  onClick={() => {
    const updated = songs.filter((_, i) => i !== index);
    setSongs(updated);
  }}
>
  Delete
</button>
  </div>
))}

<button className="purple-btn"
  onClick={() =>
    setSongs([
      ...songs,
      {
        title: "",
        artist: "",
        favorite: false,
      },
    ])
  }

>
  + Add Song
</button>

<button
 className="primary-btn"
 onClick={() => {
    setResult(
      `🎵 "${title || "My Mixtape"}" (${mood}) created with ${songs.length} song(s)!`
    );
  }}
  
>
  Generate Mixtape
</button>
<button
className="green-btn"
  onClick={saveToSupabase}
>
  Save Mixtape
</button>
<button
className="orange-btn"
  onClick={loadMixtapes}
>
  Load Saved Mixtape
</button>
{savedMixtapes.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h3>Saved Mixtapes</h3>

    {savedMixtapes.map((mix) => (
      <div  className="saved-card"
      key={mix.id}
       >
        <strong>{mix.title}</strong>
<br />
Mood: {mix.mood}
<br />
Songs: {mix.songs.length}
<br />
<br />

<button
className="small-open"
  onClick={() => {
    setTitle(mix.title);
    setMood(mix.mood);
    setSongs(mix.songs);
  }}
>
  Open
</button>
<button
className="small-delete"
  onClick={async () => {
    const { error } = await supabase
      .from("mixtapes")
      .delete()
      .eq("id", mix.id);

    if (error) {
      alert("Delete failed");
      console.error(error);
    } else {
      loadMixtapes();
    }
  }}
>
  Delete
</button>
<button
className="small-share"
  onClick={() => {
    navigator.clipboard.writeText(
      `${window.location.origin}/mixtape/${mix.id}`
    );
    alert("Share link copied!");
  }}
  
>
  Share
</button>
<br />
<br />


      </div>
    ))}
  </div>
)}

<button
className="red-btn"
  onClick={() => {
    localStorage.removeItem("mixtape");
    alert("Saved mixtape deleted!");
  }}
>
  Delete Saved Mixtape
</button>
<input
className="search-input"
  type="text"
  placeholder="Search songs..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
<button
className="blue-btn"
  onClick={() => {
    const sorted = [...songs].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSongs(sorted);
  }}
>
  Sort Songs A–Z
</button>
{result && (
    <div className="result-box"
    >
      {result}
    </div>
)}
    <div className="playlist">
  <h3>🎶 Your Playlist</h3>

  {songs.map((song, index) => (
    <div className="playlist-card" key={index}>
      <div>
        <strong>{song.title || "Untitled Song"}</strong>
        <br />
        <small>{song.artist || "Unknown Artist"}</small>
      </div>

      <div className="favorite">
        {song.favorite ? "⭐" : "🎵"}
      </div>
    </div>
  ))}
</div>
</div>
</main>
  );
}
