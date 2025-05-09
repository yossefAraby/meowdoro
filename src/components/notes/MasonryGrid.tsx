import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';
import './masonry-grid.css';

// Import the Masonry layout from Masonry-based library
// If not installed, we need to add this dependency
// npm install react-masonry-css
import Masonry from 'react-masonry-css';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Label {
  id: string;
  name: string;
  added: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'checklist';
  tasks: Task[];
  color: string;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  labels: Label[];
  createdAt: Date;
  attachments?: Attachment[];
}

interface MasonryGridProps {
  notes: Note[];
  title?: string;
  onNoteClick: (note: Note) => void;
  onNotePin: (id: string) => void;
  onNoteDelete: (id: string) => void;
  onNoteArchive: (id: string) => void;
  onNoteColorChange: (id: string, color: string) => void;
  onTaskToggle: (noteId: string, taskId: string) => void;
  onNoteSelect?: (id: string, selected: boolean) => void;
  selectedNotes?: string[];
  selectionMode?: boolean;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  notes,
  title,
  onNoteClick,
  onNotePin,
  onNoteDelete,
  onNoteArchive,
  onNoteColorChange,
  onTaskToggle,
  onNoteSelect,
  selectedNotes = [],
  selectionMode = false,
}) => {
  // Responsive breakpoints for the masonry grid
  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  // Sort notes by creation date to ensure consistent left-to-right order
  const sortedNotes = [...notes].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const handleNoteSelect = (id: string, selected: boolean) => {
    if (onNoteSelect) {
      onNoteSelect(id, selected);
    }
  };

  return (
    <div className="mb-8">
      {title && notes.length > 0 && (
        <h2 className="text-sm font-medium text-muted-foreground mb-3">{title}</h2>
      )}
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <AnimatePresence>
          {sortedNotes.map(note => (
            <div key={note.id} className="note-card">
              <NoteCard
                id={note.id}
                title={note.title}
                content={note.content}
                type={note.type}
                tasks={note.tasks}
                color={note.color}
                labels={note.labels}
                pinned={note.pinned}
                onPin={onNotePin}
                onDelete={onNoteDelete}
                onArchive={onNoteArchive}
                onColorChange={onNoteColorChange}
                onTaskToggle={(noteId, taskId) => onTaskToggle(noteId, taskId)}
                onClick={() => onNoteClick(note)}
                onSelect={selectionMode ? handleNoteSelect : undefined}
                selected={selectedNotes.includes(note.id)}
                selectionMode={selectionMode}
              />
            </div>
          ))}
        </AnimatePresence>
      </Masonry>
    </div>
  );
};

export default MasonryGrid; 