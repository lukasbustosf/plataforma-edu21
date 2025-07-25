'use client';

import React, { useState, useEffect, Fragment, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LabActivity } from '@/types/lab';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const logExecutionSchema = z.object({
  student_count: z.number().min(1, 'Debe haber al menos 1 estudiante.'),
  duration_actual_minutes: z.number().min(1, 'La duración debe ser de al menos 1 minuto.'),
  success_rating: z.number().min(1).max(5),
  engagement_rating: z.number().min(1).max(5),
  difficulty_perceived: z.number().min(1).max(5),
  notes: z.string().optional(),
  challenges_faced: z.string().optional(),
});

type LogExecutionFormValues = z.infer<typeof logExecutionSchema>;

interface LogExecutionModalProps {
  activity: LabActivity;
  children: React.ReactNode;
}

export function LogExecutionModal({ activity, children }: LogExecutionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LogExecutionFormValues>({
    resolver: zodResolver(logExecutionSchema),
    defaultValues: {
      student_count: 25,
      duration_actual_minutes: activity.duration_minutes || 30,
      success_rating: 4,
      engagement_rating: 4,
      difficulty_perceived: 3,
      notes: '',
      challenges_faced: '',
    },
  });

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0]);
    } else {
      setEvidenceFile(null);
    }
  };

  const onSubmit = async (data: LogExecutionFormValues) => {
    const formData = new FormData();
    formData.append('activity_id', activity.id);
    formData.append('student_count', String(data.student_count));
    formData.append('duration_actual_minutes', String(data.duration_actual_minutes));
    formData.append('success_rating', String(data.success_rating));
    formData.append('engagement_rating', String(data.engagement_rating));
    formData.append('difficulty_perceived', String(data.difficulty_perceived));
    formData.append('notes', data.notes || '');
    formData.append('challenges_faced', data.challenges_faced || '');
    // Puedes agregar más campos según sea necesario
    if (evidenceFile) {
      formData.append('evidence', evidenceFile);
    }
    try {
      const response = await fetch('/api/lab/activity-logs', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la ejecución.');
      }
      toast.success('¡Ejecución registrada con éxito!');
      reset();
      setEvidenceFile(null);
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar la ejecución.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Registrar Ejecución de Actividad</DialogTitle>
          <DialogDescription>
            Completa los detalles de la implementación de &quot;{activity.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" encType="multipart/form-data">
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_count">N° de Estudiantes</Label>
                <Controller
                  name="student_count"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="student_count" 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                    />
                  )}
                />
                {errors.student_count && <p className="text-red-500 text-xs mt-1">{errors.student_count.message}</p>}
              </div>
              <div>
                <Label htmlFor="duration_actual_minutes">Duración Real (min)</Label>
                 <Controller
                  name="duration_actual_minutes"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="duration_actual_minutes" 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                    />
                  )}
                />
                {errors.duration_actual_minutes && <p className="text-red-500 text-xs mt-1">{errors.duration_actual_minutes.message}</p>}
              </div>
            </div>

            <div>
              <Label>Nivel de Éxito (1-5)</Label>
              <Controller
                name="success_rating"
                control={control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                )}
              />
            </div>
            <div>
              <Label>Nivel de Involucramiento (1-5)</Label>
               <Controller
                name="engagement_rating"
                control={control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                )}
              />
            </div>
             <div>
              <Label>Dificultad Percibida (1-5)</Label>
               <Controller
                name="difficulty_perceived"
                control={control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas y Observaciones</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => <Textarea id="notes" {...field} />}
              />
            </div>
             <div>
              <Label htmlFor="challenges_faced">Desafíos Enfrentados (separados por coma)</Label>
              <Controller
                name="challenges_faced"
                control={control}
                render={({ field }) => <Input id="challenges_faced" {...field} />}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="evidence" style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Evidencia (imagen o PDF, opcional)</label>
              <input
                type="file"
                id="evidence"
                name="evidence"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'block', marginTop: 4 }}
              />
              {evidenceFile && <span style={{ fontSize: 12, color: '#555' }}>Archivo seleccionado: {evidenceFile.name}</span>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar Ejecución'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
