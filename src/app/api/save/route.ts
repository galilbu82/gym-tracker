// route.ts (API handler for Google Sheets export)
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// Define a TypeScript type for an entry
interface Entry {
  exercise: string;
  weight: string;
  week: string;
  type: string;
  date: string;
}

interface RequestBody {
  userId: string;
  data: Entry[];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await req.json();
    const { userId, data } = body;

    const sheetId = "1cygb0Z-Uhm1viiaLtpQdWkyJRwN0966Qq-31hLupQqo";

    const credentials: Record<string, unknown> = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const values: string[][] = data.map((entry: Entry) => [
      userId,
      entry.exercise,
      entry.weight,
      entry.week,
      entry.type,
      entry.date,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ message: "נתונים נשלחו ל-Google Sheets בהצלחה" });
  } catch (err: unknown) {
    console.error("Google Sheets API Error:", err);
    return new NextResponse("שגיאה בשליחה ל-Google Sheets", { status: 500 });
  }
}
