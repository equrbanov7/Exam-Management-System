"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Trophy, TrendingUp, LogOut, Play } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface Exam {
  id: string
  title: string
  subject: string
  duration: number
  questions: number
  status: "available" | "completed" | "in_progress"
  score?: number
  completedAt?: string
}

interface PracticeTest {
  id: string
  subject: string
  questions: number
  difficulty: "easy" | "medium" | "hard"
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [exams, setExams] = useState<Exam[]>([
    { id: "1", title: "Algebra Midterm", subject: "Math", duration: 60, questions: 20, status: "available" },
    {
      id: "2",
      title: "Essay Writing",
      subject: "English",
      duration: 90,
      questions: 5,
      status: "completed",
      score: 85,
      completedAt: "2024-01-20",
    },
    { id: "3", title: "Physics Quiz", subject: "Science", duration: 45, questions: 15, status: "in_progress" },
  ])
  const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([
    { id: "1", subject: "Math", questions: 10, difficulty: "easy" },
    { id: "2", subject: "English", questions: 15, difficulty: "medium" },
    { id: "3", subject: "Science", questions: 20, difficulty: "hard" },
  ])

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user || user.role !== "student") {
    return null
  }

  const completedExams = exams.filter((e) => e.status === "completed")
  const averageScore = completedExams.reduce((acc, e) => acc + (e.score || 0), 0) / completedExams.length || 0
  const totalExams = exams.length
  const availableExams = exams.filter((e) => e.status === "available").length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableExams}</div>
              <p className="text-xs text-muted-foreground">Ready to take</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExams.length}</div>
              <p className="text-xs text-muted-foreground">Out of {totalExams} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Exams</CardTitle>
                <CardDescription>Exams ready for you to take</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exams
                    .filter((e) => e.status === "available")
                    .map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-gray-600">{exam.subject}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{exam.duration} minutes</span>
                            <span>{exam.questions} questions</span>
                          </div>
                        </div>
                        <Link href={`/student/exam/${exam.id}`}>
                          <Button>
                            <Play className="h-4 w-4 mr-2" />
                            Start Exam
                          </Button>
                        </Link>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Tests</CardTitle>
                <CardDescription>Improve your skills with practice questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practiceTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{test.subject} Practice</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">{test.questions} questions</span>
                          <Badge
                            variant={
                              test.difficulty === "easy"
                                ? "default"
                                : test.difficulty === "medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {test.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline">Practice</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your latest exam performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedExams.map((exam) => (
                    <div key={exam.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-gray-600">{exam.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{exam.score}%</p>
                          <p className="text-xs text-gray-500">{exam.completedAt}</p>
                        </div>
                      </div>
                      <Progress value={exam.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((completedExams.length / totalExams) * 100)}%</span>
                    </div>
                    <Progress value={(completedExams.length / totalExams) * 100} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{completedExams.length}</p>
                      <p className="text-sm text-gray-600">Exams Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{averageScore.toFixed(0)}%</p>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
