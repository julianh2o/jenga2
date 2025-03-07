import { NextApiRequest, NextApiResponse } from "next";
import { insertRating } from "@/services/sheets";

interface RequestBody {
  name: string;
  stars: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, stars } = req.body as RequestBody;

  try {
    await insertRating(name, stars);
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).json({ error: "Error submitting data" });
  }
}
