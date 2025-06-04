import express from 'express'

const router = express.Router()

router.get('/', getNotesOfUser)
router.get('/:id', getNote)
router.post('/', createNote)
router.put('/:id', updateNote)
router.delete('/:id', deleteNote)

export default router