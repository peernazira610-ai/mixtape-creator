import { supabase } from "@/app/lib/supabase";

export default async function MixtapePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: mix, error } = await supabase
    .from("mixtapes")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !mix) {
    return <h1>Mixtape not found</h1>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>{mix.title}</h1>

      <h3>Mood: {mix.mood}</h3>

      <h2>Songs</h2>

      <ul>
        {mix.songs.map((song: any, index: number) => (
          <li key={index}>
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
  