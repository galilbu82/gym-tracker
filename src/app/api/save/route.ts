import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();

    const sheetId = "1cygb0Z-Uhm1viiaLtpQdWkyJRwN0966Qq-31hLupQqo"; // החלף ב-ID של הגוגל שיט שלך

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "app/api/save/service-account.json"), "utf8")
      ),
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
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ message: "נתונים נשלחו ל-Google Sheets בהצלחה" });
  } catch (err: any) {
    return new NextResponse("שגיאה בשליחה ל-Google Sheets", { status: 500 });
  }
}
