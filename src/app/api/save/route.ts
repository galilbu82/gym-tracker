import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();

    const sheetId = "1cygb0Z-Uhm1viiaLtpQdWkyJRwN0966Qq-31hLupQqo"; // Replace with your actual Sheet ID

    // Get the service account JSON from the environment variable
    const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!serviceAccount) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT environment variable");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccount),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const values = data.map((entry: any) => [
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
      requestBody: { values },
    });

    return NextResponse.json({ message: "נתונים נשלחו ל-Google Sheets בהצלחה" });
  } catch (err: any) {
    console.error("Google Sheets Error:", err);
    return new NextResponse("שגיאה בשליחה ל-Google Sheets", { status: 500 });
  }
}

