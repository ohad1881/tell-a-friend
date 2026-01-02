import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import supabase from "./supabase.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// helper function for algorithm
function similarity(a, b) {
  function scoreDiff(x, y) {
    return 1 - Math.abs(x - y) / 10; // נרמול: 1 = זהה, 0 = הפוך
  }

  const foodSim = scoreDiff(a.food, b.food);
  const serviceSim = scoreDiff(a.service, b.service);
  const atmoSim = scoreDiff(a.atmo, b.atmo);
  const vfmSim = scoreDiff(a.vfm, b.vfm);

  return (foodSim + serviceSim + atmoSim + vfmSim) / 4;
}

// start of api requests
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
  const {
    rest_id,
    email,
    food,
    service,
    atmo,
    vfm,
    restaurantName,
    restAddress,
  } = req.body;

  console.log(restAddress);

  const { data: rows } = await supabase
    .from("rest_ratings")
    .select("rest_id")
    .eq("rest_id", rest_id)
    .eq("email", email);

  const isNewRating = rows.length === 0;

  const { data, error: upsertError } = await supabase
    .from("rest_ratings")
    .upsert(
      [
        {
          rest_id,
          email,
          food,
          service,
          atmo,
          vfm,
          rest_name: restaurantName,
          rest_address: restAddress,
        },
      ],
      {
        onConflict: "rest_id,email",
      }
    )
    .select();
  if (upsertError) {
    console.log("UPSERT ERROR:", upsertError);
  }

  if (upsertError)
    return res.status(500).json({ error: "Failed to save rating" });

  res.json({
    success: true,
    rating: data[0],
    isNewRating,
  });
});

app.delete("/deleteRating", async (req, res) => {
  const { rest_id, email } = req.body;

  if (!rest_id || !email) {
    return res.status(400).json({ error: "Missing rest_id or email" });
  }

  const { error } = await supabase
    .from("rest_ratings")
    .delete()
    .eq("rest_id", rest_id)
    .eq("email", email);
  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete rating" });
  }

  return res.json({ success: true, deleted: true });
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

  const { data: upserted, error: upsertError } = await supabase
    .from("whoRatedRestaurants")
    .upsert({ email, how_many: newCount }, { onConflict: "email" })
    .select();

  if (upsertError) {
    console.log("UPSERT ERROR:", upsertError);
  }

  res.json({ how_many: newCount });
});
app.post("/decreaseRated", async (req, res) => {
  const { email } = req.body;

  const { data } = await supabase
    .from("whoRatedRestaurants")
    .select("how_many")
    .eq("email", email);

  const oldCount = data?.[0]?.how_many ?? 0;
  const newCount = oldCount - 1;

  const { data: upserted, error: upsertError } = await supabase
    .from("whoRatedRestaurants")
    .upsert({ email, how_many: newCount }, { onConflict: "email" })
    .select();

  if (upsertError) {
    console.log("UPSERT ERROR:", upsertError);
  }

  res.json({ how_many: newCount });
});

app.get("/ratedRestaurants", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { data, error } = await supabase
    .from("rest_ratings")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch rated restaurants" });
  }

  res.json({ restaurants: data });
});

app.get("/login", async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return res.status(401).json({ error: "Failed to login" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("email", email);

  return res.json({
    success: true,
    user: data.user,
    username: profile?.[0]?.username ?? null,
    session: data.session,
  });
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill all fields" });
  }

  if (username.length < 5 || username.length > 10) {
    return res.status(400).json({
      success: false,
      error: "username must be between 5 to 10 characters",
    });
  }

  if (password.length < 5 || password.length > 10) {
    return res.status(400).json({
      success: false,
      error: "password must be between 5 to 10 characters",
    });
  }

  const hasUpperCase = /[A-Z]/.test(password); //check if has capital letter
  const hasNumber = /\d/.test(password); // check if has number

  if (!hasUpperCase || !hasNumber) {
    return res.status(400).json({
      success: false,
      error:
        "Password must contain at least one uppercase letter and one number",
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://tell-a-friend.vercel.app/auth/callback",
    },
  });

  if (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
  const userId = data.user.id;
  const { error: profileError } = await supabase.from("profiles").upsert({
    user_id: userId,
    email: email,
    username: username,
  });

  if (profileError) {
    console.error(profileError);
    return res.status(400).json({
      success: false,
      error: "User created but profile insert failed",
    });
  }

  return res.json({
    success: true,
    user: data.user,
  });
});

app.post("/whoslikeme", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  const { data: mine, error } = await supabase
    .from("rest_ratings")
    .select("rest_id, food, service, atmo, vfm")
    .eq("email", email);

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "DB error" });
  }

  const myRests = mine;

  const restIds = myRests.map((r) => r.rest_id); // list of my restaurants

  const { data: others, error: othersErr } = await supabase // list of people who rated like me
    .from("rest_ratings")
    .select(
      `
      email,
      rest_id,
      food,
      service,
      atmo,
      vfm,
      rest_address,
      profiles:profiles(username)
    `
    )
    .in("rest_id", restIds)
    .neq("email", email);

  const similarityMap = {};

  for (const other of others) {
    // check similarity of each restaurant of others
    const myRating = mine.find((m) => m.rest_id === other.rest_id);
    if (!myRating) continue;

    const sim = similarity(myRating, other);
    const key = other.email; // המפתח הייחודי

    if (!similarityMap[key]) {
      similarityMap[key] = {
        sims: [],
        username: other.profiles?.username || null,
      };
    }

    similarityMap[key].sims.push(sim);
  }

  const similarityScores = [];

  // calc scores for each person
  for (const email in similarityMap) {
    const { sims, username } = similarityMap[email];

    const avg = sims.reduce((a, b) => a + b, 0) / sims.length;
    const numShared = sims.length;
    const weight = Math.log2(numShared + 1);
    const weightedSimilarity = avg * weight;

    similarityScores.push({
      email,
      username,
      avgSimilarity: avg,
      numShared,
      weightedSimilarity,
    });
  }

  const mostSimilar = [...similarityScores].sort(
    (a, b) => b.weightedSimilarity - a.weightedSimilarity
  );
  const leastSimilar = [...similarityScores].sort(
    (a, b) => a.weightedSimilarity - b.weightedSimilarity
  );

  return res.json({
    success: true,
    mostSimilar: mostSimilar,
    leastSimilar: leastSimilar,
  });
});
app.post("/seewhy", async (req, res) => {
  const { me, other, isLikeMe } = req.body;

  if (!me || !other) {
    return res.status(400).json({ error: "Missing emails" });
  }

  // mine
  const { data: mine } = await supabase
    .from("rest_ratings")
    .select("*")
    .eq("email", me);

  // his
  const { data: his } = await supabase
    .from("rest_ratings")
    .select("*")
    .eq("email", other);

  const shared = [];
  const mineMap = new Map(mine.map((r) => [r.rest_id, r]));

  for (const h of his) {
    if (mineMap.has(h.rest_id)) {
      const myRating = mineMap.get(h.rest_id);
      shared.push({
        rest_id: h.rest_id,
        rest_name: h.rest_name,
        my: myRating,
        his: h,
        similarity: similarity(myRating, h),
      });
    }
  }

  const heRatedNotMe = his
    .filter((h) => !mineMap.has(h.rest_id))
    .sort(
      (a, b) =>
        b.food +
        b.service +
        b.atmo +
        b.vfm -
        (a.food + a.service + a.atmo + a.vfm)
    );

  shared.sort((a, b) => b.similarity - a.similarity);

  if (isLikeMe === false) {
    shared.reverse();
  }

  return res.json({
    sharedRated: shared,
    heRatedNotMe,
  });
});
app.listen(3001, () => console.log("API running"));
