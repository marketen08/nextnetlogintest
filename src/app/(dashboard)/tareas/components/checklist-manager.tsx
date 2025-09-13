'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, CheckSquare, Square, Edit2, Trash2 } from 'lucide-react';
import type { ChecklistItem } from '@/store/types/task';

interface ChecklistManagerProps {
  checklist: ChecklistItem[];
  onChecklistChange: (checklist: ChecklistItem[]) => void;
  readOnly?: boolean;
}

export function ChecklistManager({ 
  checklist, 
  onChecklistChange, 
  readOnly = false 
}: ChecklistManagerProps) {
  const [newItemText, setNewItemText] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const completedItems = checklist.filter(item => item.completed);
  const completionPercentage = checklist.length > 0 
    ? Math.round((completedItems.length / checklist.length) * 100) 
    : 0;

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: `check-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newItemText.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      onChecklistChange([...checklist, newItem]);
      setNewItemText('');
    }
  };

  const handleToggleItem = (itemId: string) => {
    const updatedChecklist = checklist.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          completed: !item.completed,
          completedAt: !item.completed ? new Date().toISOString() : undefined
        };
      }
      return item;
    });
    onChecklistChange(updatedChecklist);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== itemId);
    onChecklistChange(updatedChecklist);
  };

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingItem(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingItem) {
      const updatedChecklist = checklist.map(item => {
        if (item.id === editingItem) {
          return { ...item, text: editText.trim() };
        }
        return item;
      });
      onChecklistChange(updatedChecklist);
      setEditingItem(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditText('');
  };

  if (readOnly && checklist.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Lista de Verificación</Label>
        {checklist.length > 0 && (
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
            {completedItems.length}/{checklist.length} ({completionPercentage}%)
          </Badge>
        )}
      </div>

      {checklist.length > 0 && (
        <div className="space-y-2">
          <Progress value={completionPercentage} className="h-2" />
          
          <Card className="border-gray-200">
            <CardContent className="pt-4 space-y-3">
              {checklist.map(item => (
                <div key={item.id} className="flex items-start gap-3 group">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => !readOnly && handleToggleItem(item.id)}
                    disabled={readOnly}
                    className="mt-0.5"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {editingItem === item.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleSaveEdit}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        >
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <span 
                          className={`text-sm ${
                            item.completed 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-900'
                          }`}
                        >
                          {item.text}
                        </span>
                        
                        {!readOnly && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStartEdit(item)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteItem(item.id)}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {!readOnly && (
        <div className="flex gap-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Agregar nuevo elemento al checklist..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      )}

      {checklist.length === 0 && !readOnly && (
        <p className="text-sm text-gray-500 text-center py-2">
          No hay elementos en el checklist. Agrega uno arriba.
        </p>
      )}
    </div>
  );
}

// Componente compacto para mostrar solo el progreso
export function ChecklistProgress({ checklist }: { checklist: ChecklistItem[] }) {
  if (!checklist || checklist.length === 0) return null;

  const completedItems = checklist.filter(item => item.completed);
  const completionPercentage = Math.round((completedItems.length / checklist.length) * 100);

  return (
    <div className="flex items-center gap-2 text-xs">
      <CheckSquare className="h-3 w-3 text-blue-500" />
      <span className="text-gray-600">
        {completedItems.length}/{checklist.length}
      </span>
      <div className="flex-1">
        <Progress value={completionPercentage} className="h-1" />
      </div>
      <span className="text-gray-500 font-medium">
        {completionPercentage}%
      </span>
    </div>
  );
}
