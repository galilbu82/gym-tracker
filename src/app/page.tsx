"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dumbbell } from "lucide-react";

export default function StudioTracker() {
  const [exercise, setExercise] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [week, setWeek] = useState("");
  const [type, setType] = useState("");
  type Entry = {
  exercise: string;
  weight: string;
  week: string;
  type: string;
};

  const [data, setData] = useState<Entry[]>([]);

  const [filterType, setFilterType] = useState("all");
  const [filterWeek, setFilterWeek] = useState("all");
  const [filterExercise, setFilterExercise] = useState("all");

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const uniqueExercises = [...new Set(data.map((item) => item.exercise))];

  useEffect(() => {
    if (exercise === "custom") {
      setShowCustomInput(true);
      setCustomExercise("");
    } else {
      setShowCustomInput(false);
    }
  }, [exercise]);

  const addEntry = () => {
    const finalExercise = exercise === "custom" ? customExercise : exercise;

    if (!finalExercise) return setErrorMessage("לא בחרת תרגיל");
    if (!weight) return setErrorMessage("לא הכנסת משקל");
    if (!week) return setErrorMessage("לא בחרת מספר שבוע");
    if (!type) return setErrorMessage("לא בחרת סוג אימון");

    setData([...data, { exercise: finalExercise, weight, week, type }]);
    setExercise("");
    setCustomExercise("");
    setWeight("");
    setWeek("");
    setType("");
    setErrorMessage("");
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

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 rounded shadow">{errorMessage}</div>
      )}
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
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>תרגיל</TableHead>
            <TableHead>משקל</TableHead>
            <TableHead>שבוע</TableHead>
            <TableHead>אימון</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.exercise}</TableCell>
              <TableCell>{item.weight} ק&apos;ג</TableCell>
              <TableCell>{item.week}</TableCell>
              <TableCell>{item.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
