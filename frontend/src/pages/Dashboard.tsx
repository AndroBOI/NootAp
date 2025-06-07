import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from 'react-hot-toast'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Note {
  _id: string
  title: string
  body: string
  userId: string
}

function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  const locationState = location.state as { userId?: string; token?: string } | null
  const storedToken = localStorage.getItem("token")

  const userId = locationState?.userId
  const token = locationState?.token || storedToken

  if (!userId || !token) {
    return <div className="p-6 text-center">No user or token found. Please log in.</div>
  }

  const [formData, setFormData] = useState({ title: "", body: "" })
  const [notes, setNotes] = useState<Note[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/app/notes/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setNotes(res.data)
      } catch (err) {
        console.error("Failed to fetch notes", err)
      }
    }

    fetchNotes()
  }, [userId, token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Trim inputs to check for empty or whitespace-only input
    const trimmedTitle = formData.title.trim()
    const trimmedBody = formData.body.trim()

    if (!trimmedTitle || !trimmedBody) {
      toast.error("Title and Body cannot be empty or just spaces.")
      return
    }

    try {
      await axios.post(
        "http://localhost:5000/app/notes",
        { title: trimmedTitle, body: trimmedBody, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
       toast.success("Note created successfully!")
      setFormData({ title: "", body: "" })
      setOpen(false) 
     

      const res = await axios.get(`http://localhost:5000/app/notes/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(res.data)
    } catch (err) {
      console.error("Failed to create note", err)
      toast.error("Failed to create note")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast.success("Logged out successfully!")
    navigate("/login")
  }

  return (
    
    <div className="max-w-2xl mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Create Note</h2>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Create Note
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create A Note</DialogTitle>
              <DialogDescription>
                Create a new note to keep track of your thoughts and ideas.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title-1">Title</Label>
                <Input
                  value={formData.title}
                  onChange={handleChange}
                  id="title-1"
                  name="title"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="body-1">Body</Label>
                <Input
                  value={formData.body}
                  onChange={handleChange}
                  id="body-1"
                  name="body"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <h3 className="text-xl font-semibold mb-4 mt-5">Your Notes</h3>
      {notes.length === 0 ? (
        <p className="text-center text-muted-foreground">No notes yet.</p>
      ) : (
        <ul className="space-y-4">
          {[...notes].reverse().map(note => (
            <li
              key={note._id}
              className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800"
            >
              <strong className="block text-lg mb-1">{note.title}</strong>
              <p>{note.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard
