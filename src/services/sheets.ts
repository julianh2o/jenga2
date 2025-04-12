import { google } from 'googleapis';
import _ from 'lodash';

interface Rule {
    id: string;
    rule: string;
    tags: string[];
    level: number;
    weight: number;
    category: string;
    subcategory: string;
    originator: string;
    notes: string;
}

function getSheets() {
    if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64) {
        throw new Error("Missing required environment variables");
    }

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(Buffer.from(process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64 || '', 'base64').toString()),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}



export async function insertRating(id: string, user: string, rating: number, preset: string) {
    const sheets = getSheets();
    const range = "Ratings!A:D";

    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range,
        valueInputOption: "RAW",
        requestBody: {
            values: [[id, user, rating, preset]]
        }
    });
}

export async function fetchRules(): Promise<Rule[]> {
    const sheets = getSheets();
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
    // Map remaining rows to Rule objects

    const rulesRaw = values.slice(1)
    const validateRow = (row: string[]) => {
        const errors = [];
        if (row[headers.indexOf('ID')] === undefined) errors.push("ID is undefined");
        if (!parseInt(row[headers.indexOf('Level')])) errors.push("Level is not a number");
        if (row[headers.indexOf('Category')] === undefined) errors.push("Category is undefined");
        return errors;
    }

    const ruleErrors = _.flatten(rulesRaw.map((row) => {
        return validateRow(row).map(
            (error) => `${row[headers.indexOf('Rule')]} : ${error}`
        )
    }));
    if (ruleErrors.length > 0) {
        console.error("Rule errors",ruleErrors);
    }

    const filteredRules = rulesRaw.filter((row) => validateRow(row).length === 0);

    return filteredRules.map((row): Rule => ({
        id: row[headers.indexOf('ID')] || undefined,
        rule: row[headers.indexOf('Rule')] || undefined,
        tags: (row[headers.indexOf('Tags')] || '').split(';').map((tag: string) => tag.trim()).filter(Boolean),
        level: parseInt(row[headers.indexOf('Level')]) || 1,
        weight: parseInt(row[headers.indexOf('Weight')]) || 1,
        category: row[headers.indexOf('Category')] || undefined,
        subcategory: row[headers.indexOf('Subcategory')] || undefined,
        originator: row[headers.indexOf('Originator')] || undefined,
        notes: row[headers.indexOf('Notes')] || undefined
    }));
}
