import { google } from 'googleapis';

interface Rule {
    rule: string;
    tags: string;
    level: string;
    weight: number;
    category: string;
    subcategory: string;
    originator: string;
    notes: string;
}

export async function insertRating(name: string, stars: number) {
    // Validate required environment variables
    if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SHEETS_CREDENTIALS) {
        throw new Error("Missing required environment variables");
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const range = "Sheet1!A:B";

    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range,
        valueInputOption: "RAW",
        requestBody: {
            values: [[name, stars]]
        }
    });
}

export async function fetchRules(): Promise<Rule[]> {
    // Validate required environment variables
    if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SHEETS_CREDENTIALS) {
        throw new Error("Missing required environment variables");
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const range = "Rules!A:H"; // Columns A through H

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range,
    });

    const values = response.data.values;

    if (!values || values.length < 2) { // Check if there's data and at least a header row
        return [];
    }

    // Get header row and use it to map column names to indices
    const headers = values[0];
    const columnMap = {
        Rule: headers.indexOf('Rule'),
        Tags: headers.indexOf('Tags'),
        Level: headers.indexOf('Level'),
        Weight: headers.indexOf('Weight'),
        Category: headers.indexOf('Category'),
        Subcategory: headers.indexOf('Subcategory'),
        Originator: headers.indexOf('Originator'),
        Notes: headers.indexOf('Notes')
    };

    // Map remaining rows to Rule objects using header indices
    return values.slice(1).map((row): Rule => ({
        rule: row[columnMap.Rule] || '',
        tags: row[columnMap.Tags] || '',
        level: row[columnMap.Level] || '',
        weight: Number(row[columnMap.Weight]) || 0,
        category: row[columnMap.Category] || '',
        subcategory: row[columnMap.Subcategory] || '',
        originator: row[columnMap.Originator] || '',
        notes: row[columnMap.Notes] || ''
    }));
}
