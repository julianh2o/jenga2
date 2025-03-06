import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

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
    // Validate required environment variables
    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error("Missing required environment variables");
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: "./googleCredentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const range = "Sheet1!A:B";

    console.log(process.env.GOOGLE_SHEETS_ID);
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, stars]]
      }
    });

    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).json({ error: "Error submitting data" });
  }
}
