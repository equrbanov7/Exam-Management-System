"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  type: "multiple_choice" | "essay"
  question: string
  options?: string[]
  answer?: string
}

interface ExamData {
  id: string
  title: string
  subject: string
  duration: number
  questions: Question[]
}

export default function ExamPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string

  const [exam, setExam] = useState<ExamData>({
    id: examId,
    title: "Algebra Midterm",
    subject: "Math",
    duration: 60,
    questions: [
      {
        id: "1",
        type: "multiple_choice",
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      },
      {
        id: "2",
        type: "multiple_choice",
        question: "Which of the following is equivalent to (x + 3)²?",
        options: ["x² + 6x + 9", "x² + 3x + 9", "x² + 6x + 6", "x² + 9"],
      },
      {
        id: "3",
        type: "essay",
        question:
          "Explain the process of solving a quadratic equation using the quadratic formula. Provide an example.",
      },
    ],
  })

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60) // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/auth/login")
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user, router])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setDirection(1)
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Here you would typically send answers to the backend
    console.log("Submitted answers:", answers)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((currentQuestion + 1) / exam.questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Exam Submitted!</CardTitle>
            <CardDescription>Your answers have been recorded successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <p>
              You answered {answeredQuestions} out of {exam.questions.length} questions.
            </p>
            <Button onClick={() => router.push("/student/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = exam.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600">{exam.subject}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-primary">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              <Button onClick={handleSubmit} variant="destructive">
                <Flag className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {exam.questions.length}
            </span>
            <span className="text-sm text-gray-600">{answeredQuestions} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-lg leading-relaxed">{currentQ.question}</div>

                  {currentQ.type === "multiple_choice" && currentQ.options && (
                    <RadioGroup
                      value={answers[currentQ.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    >
                      {currentQ.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQ.type === "essay" && (
                    <Textarea
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[150px]"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentQuestion ? 1 : -1)
                  setCurrentQuestion(index)
                }}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-primary text-white"
                    : answers[exam.questions[index].id]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            onClick={currentQuestion === exam.questions.length - 1 ? handleSubmit : handleNext}
            className={currentQuestion === exam.questions.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {currentQuestion === exam.questions.length - 1 ? "Submit Exam" : "Next"}
            {currentQuestion !== exam.questions.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </main>
    </div>
  )
}
