import { NextApiRequest, NextApiResponse } from "next";
import { insertRating } from "@/services/sheets";

interface RequestBody {
  id: string;
  user: string;
  rating: number;
  preset: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { id, user, rating, preset } = req.body as RequestBody;

  try {
    await insertRating(id, user, rating, preset);
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).json({ error: "Error submitting data" });
  }
}
