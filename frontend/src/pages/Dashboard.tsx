import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "react-hot-toast"
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
import { Edit2, Trash2 } from "lucide-react"

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

  // States for editing notes
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ title: "", body: "" })

  // New state for search input
  const [searchTerm, setSearchTerm] = useState("")

  // State for view full note dialog
  const [viewNote, setViewNote] = useState<Note | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

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
        { headers: { Authorization: `Bearer ${token}` } }
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

  // --- Edit note handlers ---

  const handleEditOpen = (note: Note) => {
    setEditNote(note)
    setEditFormData({ title: note.title, body: note.body })
    setEditOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedTitle = editFormData.title.trim()
    const trimmedBody = editFormData.body.trim()

    if (!trimmedTitle || !trimmedBody) {
      toast.error("Title and Body cannot be empty or just spaces.")
      return
    }

    if (!editNote) return

    try {
      await axios.put(
        `http://localhost:5000/app/notes/${editNote._id}`,
        { title: trimmedTitle, body: trimmedBody },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Note updated successfully!")

      const res = await axios.get(`http://localhost:5000/app/notes/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(res.data)

      setEditOpen(false)
      setEditNote(null)
    } catch (err) {
      console.error("Failed to update note", err)
      toast.error("Failed to update note")
    }
  }

  // --- Delete note handler ---

  const handleDelete = async (noteId: string) => {
    try {
      await axios.delete(`http://localhost:5000/app/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Note deleted successfully!")
      setNotes(notes.filter(note => note._id !== noteId))
    } catch (err) {
      console.error("Failed to delete note", err)
      toast.error("Failed to delete note")
    }
  }

  // Filter notes based on search term (case-insensitive)
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Open view dialog with clicked note
  const handleViewNote = (note: Note) => {
    setViewNote(note)
    setViewOpen(true)
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

      {/* Create Note Dialog */}
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
                <textarea
                  value={formData.body}
                  onChange={handleChange}
                  id="body-1"
                  name="body"
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Edit Note Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>Update your note below.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-body">Body</Label>
                <textarea
                  id="edit-body"
                  name="body"
                  value={editFormData.body}
                  onChange={handleEditChange}
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Full Note Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{viewNote?.title}</DialogTitle>
            <DialogDescription>{viewNote?.body}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search bar */}
      <div className="my-4">
        <Input
          placeholder="Search notes by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4 mt-5">Your Notes</h3>



      {filteredNotes.length === 0 ? (
        <p className="text-center text-muted-foreground">No notes found.</p>
      ) : (
        [...filteredNotes]
          .reverse()
          .map(note => (
            <li
              key={note._id}
              className="p-4 list-none border rounded-md cursor-pointer shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleViewNote(note)}
              aria-label={`View full note: ${note.title}`}
            >
              <div className="flex justify-between gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <strong className="block text-lg mb-1 truncate">{note.title}</strong>
                  <p
                    className="text-sm text-gray-700 dark:text-gray-300 break-words overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '4.5em',
                    }}
                  >
                    {note.body}
                  </p>
                </div>

                <div
                  className="flex-shrink-0 flex flex-col space-y-2 items-center"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditOpen(note)}
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    aria-label="Edit note"
                  >
                    <Edit2 size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note._id)}
                    className="text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                    aria-label="Delete note"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </li>
          ))
      )}

    </div>
  )
}

export default Dashboard
