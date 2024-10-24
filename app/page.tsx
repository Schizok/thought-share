'use client'
import { useEffect } from 'react'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react'
import { db } from '../firebase'
import { collection, addDoc, getDocs, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore'

interface Thought {
  id: string
  content: string
  timestamp: Timestamp
  likes: number
  liked: boolean
}

export default function Component() {
  const [currentThought, setCurrentThought] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [thoughts, setThoughts] = useState<Thought[]>([])

  const fetchThoughts = async () => {
    try {
      const thoughtsCollection = collection(db, 'thoughts')
      const thoughtsQuery = query(thoughtsCollection, orderBy('timestamp', 'desc'))
      const thoughtsSnapshot = await getDocs(thoughtsQuery)
      const thoughtsList = thoughtsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          content: data.content,
          timestamp: data.timestamp,
          likes: Number(data.likes) || 0, // Ensure likes is a number
          liked: false
        } as Thought
      })
      setThoughts(thoughtsList)
    } catch (error) {
      console.error("Error fetching thoughts: ", error)
    }
  }

  useEffect(() => {
    fetchThoughts()
  }, [])

  const handlePost = async () => {
    if (currentThought.trim()) {
      const newThought = {
        content: currentThought,
        timestamp: Timestamp.now(),
        likes: 0
      }

      try {
        const docRef = await addDoc(collection(db, 'thoughts'), newThought)
        setThoughts([{
          ...newThought,
          id: docRef.id,
          liked: false
        } as Thought, ...thoughts])
        setCurrentThought('')
      } catch (error) {
        console.error("Error adding thought: ", error)
      }
    }
  }

  const navigateThoughts = (direction: string) => {
    if (direction === 'next' && currentIndex < thoughts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleLike = async () => {
    if (thoughts.length > 0 && thoughts[currentIndex]) {
      const thought = thoughts[currentIndex]
      const thoughtRef = doc(db, 'thoughts', thought.id)
      const currentLikes = Number(thought.likes) || 0 // Ensure current likes is a number
      const newLikes = thought.liked ? currentLikes - 1 : currentLikes + 1

      try {
        await updateDoc(thoughtRef, {
          likes: newLikes
        })

        setThoughts(thoughts.map((t, index) => {
          if (index === currentIndex) {
            return {
              ...t,
              likes: newLikes,
              liked: !t.liked
            }
          }
          return t
        }))
      } catch (error) {
        console.error("Error updating likes: ", error)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">ThoughtShare</h1>
        </div>
      </nav>

      <div className="flex-grow container mx-auto max-w-2xl p-4 space-y-6">
        <Card className="w-full">
          <CardHeader className="text-center">
            <p className="text-lg italic font-serif">
              "To share a thought is to ease the mind, letting it rest in the release. In the quiet that follows, those words may take flight, offering others understanding, inspiration, or the simple comfort of knowing they are not alone"
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your thoughts here..."
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              className="min-h-32 whitespace-pre-wrap"
            />

            <Button
              className="w-full"
              onClick={handlePost}
              disabled={!currentThought.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Share Anonymously
            </Button>
          </CardContent>
        </Card>

        {thoughts.length > 0 && (
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <pre className="whitespace-pre-wrap break-words font-sans text-lg flex-grow">
                  {thoughts[currentIndex].content}
                </pre>
                <div className="flex flex-col items-center ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full p-0 w-10 h-10 heart-button ${thoughts[currentIndex].liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    aria-label={thoughts[currentIndex].liked ? "Unlike this thought" : "Like this thought"}
                  >
                    <Heart className="w-5 h-5 heart-icon" />
                  </Button>
                  <span className="text-sm mt-1">{thoughts[currentIndex].likes}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-between">
              <Button
                variant="outline"
                onClick={() => navigateThoughts('prev')}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {thoughts.length}
              </span>

              <Button
                variant="outline"
                onClick={() => navigateThoughts('next')}
                disabled={currentIndex === thoughts.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <style jsx>{`
        .heart-button {
          transition: transform 0.2s ease;
        }
        .heart-button:hover {
          transform: scale(1.1);
        }
        .heart-button:active {
          transform: scale(0.9);
        }
        .heart-icon {
          fill: transparent;
          stroke: currentColor;
          stroke-width: 2;
          transition: fill 0.2s ease;
        }
        .heart-button.liked .heart-icon {
          fill: red;
          stroke: red;
        }
      `}</style>
    </div>
  )
}
