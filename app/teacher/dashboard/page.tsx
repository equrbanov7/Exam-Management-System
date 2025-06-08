"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, FileText, BarChart3, Plus, LogOut, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Question {
  id: string
  title: string
  subject: string
  type: "pdf" | "word" | "manual"
  difficulty: "easy" | "medium" | "hard"
  createdAt: string
}

interface Student {
  id: string
  name: string
  email: string
  examsTaken: number
  averageScore: number
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", title: "Algebra Basics", subject: "Math", type: "manual", difficulty: "easy", createdAt: "2024-01-15" },
    { id: "2", title: "Essay Writing", subject: "English", type: "pdf", difficulty: "medium", createdAt: "2024-01-20" },
  ])
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Jane Student", email: "student@example.com", examsTaken: 5, averageScore: 85 },
    { id: "2", name: "John Doe", email: "john@example.com", examsTaken: 3, averageScore: 92 },
  ])
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    subject: "",
    type: "manual" as "pdf" | "word" | "manual",
    difficulty: "medium" as "easy" | "medium" | "hard",
    content: "",
  })

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCreateQuestion = () => {
    const question: Question = {
      id: Date.now().toString(),
      title: newQuestion.title,
      subject: newQuestion.subject,
      type: newQuestion.type,
      difficulty: newQuestion.difficulty,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setQuestions([...questions, question])
    setNewQuestion({ title: "", subject: "", type: "manual", difficulty: "medium", content: "" })
  }

  if (!user || user.role !== "teacher") {
    return null
  }

  const totalQuestions = questions.length
  const totalStudents = students.length
  const averageScore = students.reduce((acc, s) => acc + s.averageScore, 0) / students.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active learners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Class performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(questions.map((q) => q.subject)).size}</div>
              <p className="text-xs text-muted-foreground">Active subjects</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="questions">Question Management</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Question</CardTitle>
                <CardDescription>Add questions via upload or manual entry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Question Title</Label>
                      <Input
                        id="title"
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        placeholder="Enter question title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={newQuestion.subject}
                        onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                        placeholder="e.g., Math, English, Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Question Type</Label>
                      <Select
                        value={newQuestion.type}
                        onValueChange={(value: "pdf" | "word" | "manual") =>
                          setNewQuestion({ ...newQuestion, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual Entry</SelectItem>
                          <SelectItem value="pdf">PDF Upload</SelectItem>
                          <SelectItem value="word">Word Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={newQuestion.difficulty}
                        onValueChange={(value: "easy" | "medium" | "hard") =>
                          setNewQuestion({ ...newQuestion, difficulty: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {newQuestion.type === "manual" ? (
                    <div>
                      <Label htmlFor="content">Question Content</Label>
                      <Textarea
                        id="content"
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        placeholder="Enter your question here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label>File Upload</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Drop your {newQuestion.type.toUpperCase()} file here or click to browse
                        </p>
                        <Button variant="outline" className="mt-2">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleCreateQuestion} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Question
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question Bank</CardTitle>
                <CardDescription>Manage your existing questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{question.title}</p>
                          <p className="text-sm text-gray-600">{question.subject}</p>
                        </div>
                        <Badge variant="outline">{question.type}</Badge>
                        <Badge
                          variant={
                            question.difficulty === "easy"
                              ? "default"
                              : question.difficulty === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Monitor your students' progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Exams Taken</p>
                          <p className="text-lg font-bold text-primary">{student.examsTaken}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Average Score</p>
                          <p className="text-lg font-bold text-green-600">{student.averageScore}%</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed insights into exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                  <p className="text-sm text-gray-500 mt-2">Charts and detailed reports will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
