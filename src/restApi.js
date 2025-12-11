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

  if (!rest_id || !email)
    return res.status(400).json({ error: "Missing rest_id or email" });

  const { data, error } = await supabase
    .from("rest_ratings")
    .upsert([{ rest_id, email, food, service, atmo, vfm }], {
      onConflict: "rest_id,email",
    })
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save rating" });
  }

  res.json({ success: true, rating: data[0] });
});

app.listen(3001, () => console.log("API running"));
