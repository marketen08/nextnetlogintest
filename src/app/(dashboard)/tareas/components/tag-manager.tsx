'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Plus, Palette, Edit2 } from 'lucide-react';
import type { TaskTag } from '@/store/types/task';

interface TagManagerProps {
  availableTags: TaskTag[];
  selectedTags: TaskTag[];
  onTagsChange: (tags: TaskTag[]) => void;
  onCreateTag?: (tag: Omit<TaskTag, 'id'>) => void;
  onUpdateTag?: (tagId: string, updates: Partial<TaskTag>) => void;
  onDeleteTag?: (tagId: string) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#14B8A6', // teal
  '#6366F1', // indigo
  '#F97316', // orange
  '#84CC16', // lime
  '#06B6D4', // cyan
  '#A855F7', // purple
];

export function TagManager({
  availableTags,
  selectedTags,
  onTagsChange,
  onCreateTag,
  onUpdateTag,
  onDeleteTag
}: TagManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [editingTag, setEditingTag] = useState<TaskTag | null>(null);

  const handleCreateTag = () => {
    if (newTagName.trim() && onCreateTag) {
      const tagId = newTagName.toLowerCase().replace(/\s+/g, '-');
      onCreateTag({
        name: newTagName.trim(),
        color: newTagColor
      });
      setNewTagName('');
      setNewTagColor(PRESET_COLORS[0]);
      setIsDialogOpen(false);
    }
  };

  const handleUpdateTag = (tag: TaskTag, updates: Partial<TaskTag>) => {
    if (onUpdateTag) {
      onUpdateTag(tag.id, updates);
    }
    setEditingTag(null);
  };

  const handleToggleTag = (tag: TaskTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveSelectedTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  return (
    <div className="space-y-3">
      <Label>Etiquetas</Label>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag.id}
              variant="secondary"
              style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
              className="border"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveSelectedTag(tag.id)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Available Tags */}
      <div className="flex flex-wrap gap-2">
        {availableTags
          .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
          .map(tag => (
            <div key={tag.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleToggleTag(tag)}
                className="inline-flex items-center"
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-opacity-10"
                  style={{ 
                    color: tag.color, 
                    borderColor: tag.color,
                    backgroundColor: 'transparent'
                  }}
                >
                  {tag.name}
                </Badge>
              </button>
              
              {/* Edit Tag */}
              {editingTag?.id === tag.id ? (
                <EditTagForm
                  tag={tag}
                  onSave={(updates) => handleUpdateTag(tag, updates)}
                  onCancel={() => setEditingTag(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingTag(tag)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
      </div>

      {/* Create New Tag */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Etiqueta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Etiqueta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tag-name">Nombre</Label>
              <Input
                id="tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nombre de la etiqueta"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
            </div>
            
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newTagColor === color ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  variant="outline"
                  style={{ color: newTagColor, borderColor: newTagColor }}
                >
                  {newTagName || 'Vista previa'}
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
              >
                Crear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EditTagFormProps {
  tag: TaskTag;
  onSave: (updates: Partial<TaskTag>) => void;
  onCancel: () => void;
}

function EditTagForm({ tag, onSave, onCancel }: EditTagFormProps) {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), color });
    }
  };

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <div />
      </PopoverTrigger>
      <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="space-y-3">
          <h4 className="font-medium">Editar Etiqueta</h4>
          
          <div>
            <Label htmlFor="edit-tag-name">Nombre</Label>
            <Input
              id="edit-tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') onCancel();
              }}
              autoFocus
            />
          </div>
          
          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {PRESET_COLORS.map(presetColor => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-6 h-6 rounded border-2 ${
                    color === presetColor ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
            
            <div className="mt-2">
              <Badge
                variant="outline"
                style={{ color, borderColor: color }}
              >
                {name || tag.name}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="button" size="sm" onClick={handleSave} disabled={!name.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
