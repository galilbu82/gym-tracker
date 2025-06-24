// page.tsx (StudioTracker with export to Google Sheets)
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dumbbell } from "lucide-react";

// type for entries
type Entry = {
  exercise: string;
  weight: string;
  week: string;
  type: string;
  date: string;
};

export default function StudioTracker() {
  const [exercise, setExercise] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [week, setWeek] = useState("");
  const [type, setType] = useState("");
  const [data, setData] = useState<Entry[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterWeek, setFilterWeek] = useState("all");
  const [filterExercise, setFilterExercise] = useState("all");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("guest");

  const uniqueExercises = [...new Set(data.map((item) => item.exercise))];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("user") || "guest";
    setUserId(id);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`gym-data-${userId}`);
    if (saved) setData(JSON.parse(saved));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`gym-data-${userId}`, JSON.stringify(data));
  }, [data, userId]);

  useEffect(() => {
    setShowCustomInput(exercise === "custom");
  }, [exercise]);

  const addEntry = () => {
    const finalExercise = exercise === "custom" ? customExercise : exercise;
    if (!finalExercise) return setErrorMessage("לא בחרת תרגיל");
    if (!weight) return setErrorMessage("לא הכנסת משקל");
    if (!week) return setErrorMessage("לא בחרת מספר שבוע");
    if (!type) return setErrorMessage("לא בחרת סוג אימון");

    const newEntry: Entry = {
      exercise: finalExercise,
      weight,
      week,
      type,
      date: new Date().toLocaleDateString("he-IL"),
    };
    setData([...data, newEntry]);
    setExercise("");
    setCustomExercise("");
    setWeight("");
    setWeek("");
    setType("");
    setErrorMessage("");
  };

  const exportToGoogleSheets = async () => {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, data }),
    });
    const msg = await res.text();
    alert(msg);
  };

  const filteredData = data.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const weekMatch = filterWeek === "all" || item.week === filterWeek;
    const exerciseMatch = filterExercise === "all" || item.exercise === filterExercise;
    return typeMatch && weekMatch && exerciseMatch;
  });

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Dumbbell className="w-8 h-8 text-gray-800" />
        <h1 className="text-3xl font-bold text-gray-800">Gym Tracker</h1>
      </div>

      {errorMessage && <div className="bg-red-100 text-red-700 p-2 rounded shadow">{errorMessage}</div>}

      <Card>
        <CardContent className="p-4 space-y-2">
          <Select value={exercise} onValueChange={setExercise}>
            <SelectTrigger>{exercise && exercise !== "custom" ? exercise : "בחר או כתוב תרגיל"}</SelectTrigger>
            <SelectContent>
              {uniqueExercises.map((ex, i) => (
                <SelectItem key={i} value={ex}>{ex}</SelectItem>
              ))}
              <SelectItem value="custom">+ חדש</SelectItem>
            </SelectContent>
          </Select>

          {showCustomInput && (
            <Input placeholder="הכנס תרגיל חדש" value={customExercise} onChange={(e) => setCustomExercise(e.target.value)} />
          )}

          <Input placeholder="משקל" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" />

          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger>{week ? `שבוע ${week}` : "בחר שבוע"}</SelectTrigger>
            <SelectContent>
              {["1", "2", "3", "4"].map((w) => (
                <SelectItem key={w} value={w}>{`שבוע ${w}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger>{type ? `אימון ${type}` : "בחר סוג אימון"}</SelectTrigger>
            <SelectContent>
              {["A", "B", "C"].map((t) => (
                <SelectItem key={t} value={t}>{`אימון ${t}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={addEntry}>הוסף</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>סנן לפי סוג אימון</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הצג הכל</SelectItem>
              {["A", "B", "C"].map((t) => (
                <SelectItem key={t} value={t}>{`אימון ${t}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterWeek} onValueChange={setFilterWeek}>
            <SelectTrigger>סנן לפי שבוע</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הצג הכל</SelectItem>
              {["1", "2", "3", "4"].map((w) => (
                <SelectItem key={w} value={w}>{`שבוע ${w}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterExercise} onValueChange={setFilterExercise}>
            <SelectTrigger>סנן לפי תרגיל</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הצג הכל</SelectItem>
              {uniqueExercises.map((ex, i) => (
                <SelectItem key={i} value={ex}>{ex}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={exportToGoogleSheets}>ייצא ל-Google Sheets</Button>
        </CardContent>
      </Card>

      <Table>
       <TableHeader>
          <TableRow>
            <TableHead>תרגיל</TableHead>
            <TableHead>משקל</TableHead>
            <TableHead>שבוע</TableHead>
            <TableHead>אימון</TableHead>
            <TableHead>תאריך</TableHead>
            <TableHead>מחק</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {filteredData.map((item, index) => (
             <TableRow key={index}>
              <TableCell>{item.exercise}</TableCell>
              <TableCell>{item.weight} ק&quot;ג</TableCell>
              <TableCell>{item.week}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                 <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newData = [...data];
                      newData.splice(index, 1);
                      setData(newData);
                    }}
                 >
                   מחק
                 </Button>
               </TableCell>
             </TableRow>
    ))}
  </TableBody>
</Table>

    </div>
  );
}
