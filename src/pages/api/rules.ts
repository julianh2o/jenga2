import { NextApiRequest, NextApiResponse } from "next";
import { fetchRules } from "@/services/sheets";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const rules = await fetchRules();
        res.status(200).json(rules);
    } catch (error) {
        console.error("Error fetching rules:", error);
        res.status(500).json({ error: "Error fetching rules" });
    }
}
