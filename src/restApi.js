import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import supabase from "./supabase.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  const name = req.query.name;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    name
  )}+restaurant&key=${process.env.GOOGLE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  res.json({ results: data.results || [] });
});

app.post("/rateRest", async (req, res) => {
  const { rest_id, email, food, service, atmo, vfm } = req.body;

  const { data: existing } = await supabase
    .from("rest_ratings")
    .select("rest_id")
    .eq("rest_id", rest_id)
    .eq("email", email)
    .single();

  const isNewRating = !existing;

  const { data, error } = await supabase
    .from("rest_ratings")
    .upsert([{ rest_id, email, food, service, atmo, vfm }], {
      onConflict: "rest_id,email",
    })
    .select();

  if (error) return res.status(500).json({ error: "Failed to save rating" });

  res.json({
    success: true,
    rating: data[0],
    isNewRating,
  });
});

app.get("/howManyRated", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { data, error } = await supabase
    .from("whoRatedRestaurants")
    .select("how_many")
    .eq("email", email);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch count" });
  }

  const howMany = data?.[0]?.how_many ?? 0;
  res.json({ how_many: howMany });
});

app.post("/increaseRated", async (req, res) => {
  const { email } = req.body;

  const { data } = await supabase
    .from("whoRatedRestaurants")
    .select("how_many")
    .eq("email", email);

  const oldCount = data?.[0]?.how_many ?? 0;
  const newCount = oldCount + 1;

  await supabase
    .from("whoRatedRestaurants")
    .upsert({ email, how_many: newCount }, { onConflict: "email" });

  res.json({ how_many: newCount });
});
app.listen(3001, () => console.log("API running"));
