'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Compound/Modal'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/Button'
import { Heading2, Text, Small } from '@/components/ui/Typography'
import { Book } from '@/types/book'
import Image from 'next/image'
import { useBookStore } from '@/stores/book-store'
import toast from 'react-hot-toast'

interface BookDetailsModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
}

export function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
  const { updateBook } = useBookStore()

  const [rating, setRating] = useState<number>(0)
  const [notes, setNotes] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      setRating(book.rating || 0)
      setNotes(book.personal_notes || '')
    }
  }, [book])

  if (!book) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateBook(book.id, {
        rating: rating || null,
        personal_notes: notes.trim() || null,
      })
      toast.success('Book updated successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to update book:', error)
      toast.error('Failed to update book')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    rating !== (book.rating || 0) || notes !== (book.personal_notes || '')

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Modal.Header>
          <Modal.Title>Book Details</Modal.Title>
        </Modal.Header>

        <div className="p-6 space-y-6">
          {/* Book Cover and Info */}
          <div className="flex gap-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <Image
                src={book.cover_url || '/book-placeholder.svg'}
                alt={`${book.title} cover`}
                width={150}
                height={225}
                className="rounded-md shadow-lg"
              />
            </div>

            {/* Book Information */}
            <div className="flex-1 space-y-3">
              <div>
                <Heading2 className="!text-xl mb-1">{book.title}</Heading2>
                {book.subtitle && (
                  <Text className="text-gray-600 mb-2">{book.subtitle}</Text>
                )}
                <Text className="font-medium text-gray-700">{book.author}</Text>
              </div>

              {book.publisher && (
                <div>
                  <Small className="text-gray-500">Publisher</Small>
                  <Text className="text-sm">{book.publisher}</Text>
                </div>
              )}

              {book.published_date && (
                <div>
                  <Small className="text-gray-500">Published</Small>
                  <Text className="text-sm">
                    {new Date(book.published_date).getFullYear()}
                  </Text>
                </div>
              )}

              {book.page_count && (
                <div>
                  <Small className="text-gray-500">Pages</Small>
                  <Text className="text-sm">{book.page_count}</Text>
                </div>
              )}

              {book.isbn && (
                <div>
                  <Small className="text-gray-500">ISBN</Small>
                  <Text className="text-sm font-mono text-xs">{book.isbn}</Text>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <Small className="text-gray-500">Status</Small>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  book.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : book.status === 'reading'
                    ? 'bg-blue-100 text-blue-800'
                    : book.status === 'tbr'
                    ? 'bg-amber-100 text-amber-800'
                    : book.status === 'dnf'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {book.status === 'tbr'
                  ? 'To Be Read'
                  : book.status === 'reading'
                  ? 'Currently Reading'
                  : book.status === 'completed'
                  ? 'Completed'
                  : book.status === 'dnf'
                  ? 'Did Not Finish'
                  : book.status}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <Small className="text-gray-500 mb-2 block">Your Rating</Small>
            <StarRating
              rating={rating}
              onChange={setRating}
              size="lg"
              showLabel
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label htmlFor="notes" className="block">
              <Small className="text-gray-500 mb-2">Personal Notes</Small>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your thoughts, quotes, or notes about this book..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm"
            />
            <Small className="text-gray-400 mt-1">
              {notes.length} characters
            </Small>
          </div>

          {/* Dates */}
          {(book.date_added || book.date_started || book.date_completed) && (
            <div className="border-t pt-4 space-y-2">
              {book.date_added && (
                <div className="flex justify-between text-sm">
                  <Small className="text-gray-500">Added</Small>
                  <Text className="text-sm">
                    {new Date(book.date_added).toLocaleDateString()}
                  </Text>
                </div>
              )}
              {book.date_started && (
                <div className="flex justify-between text-sm">
                  <Small className="text-gray-500">Started</Small>
                  <Text className="text-sm">
                    {new Date(book.date_started).toLocaleDateString()}
                  </Text>
                </div>
              )}
              {book.date_completed && (
                <div className="flex justify-between text-sm">
                  <Small className="text-gray-500">Completed</Small>
                  <Text className="text-sm">
                    {new Date(book.date_completed).toLocaleDateString()}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
