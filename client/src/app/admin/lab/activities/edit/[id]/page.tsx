"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const BLOOM_LEVELS = [
  'recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'
];
const CYCLES = [
  'PK', 'K1', 'K2', '1B', '2B', '3B', '4B', '5B', '6B'
];

export default function EditLabActivityPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    status: "inactive",
    description: "",
    duration_minutes: 0,
    target_cycle: "",
    bloom_level: "",
    group_size: 0,
    difficulty_level: 1,
    cover_image_url: "",
    video_url: "",
    resource_urls: [],
    required_material_ids: [],
    steps_markdown: "",
    assessment_markdown: "",
    learning_objectives: [],
    preparation_time_minutes: 5,
    cleanup_time_minutes: 5,
    author: "",
    reviewed_by: "",
    tags: [],
    oa_ids: [],
    subject: "",
    grade_level: "",
    indicators_markdown: ""
  });
  const [newResource, setNewResource] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newOA, setNewOA] = useState("");
  const [newObjective, setNewObjective] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    fetch(`/api/lab/activities/id/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar la actividad");
        const result = await res.json();
        if (!result.success) throw new Error(result.message || "Error desconocido");
        setActivity(result.data);
        setForm({
          ...form,
          ...result.data,
          resource_urls: result.data.resource_urls || [],
          tags: result.data.tags || [],
          oa_ids: result.data.oa_ids || [],
          learning_objectives: result.data.learning_objectives || [],
          required_material_ids: result.data.required_material_ids || [],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
  }

  function handleAddToList(field: keyof typeof form, value: string) {
    if (!value) return;
    setForm({ ...form, [field]: [...(form[field] as string[] || []), value] });
    if (field === 'resource_urls') setNewResource("");
    if (field === 'tags') setNewTag("");
    if (field === 'oa_ids') setNewOA("");
    if (field === 'learning_objectives') setNewObjective("");
  }

  function handleRemoveFromList(field: keyof typeof form, idx: number) {
    setForm({ ...form, [field]: (form[field] as string[]).filter((_: string, i: number) => i !== idx) });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Aquí iría la lógica de guardado (fetch PUT/PATCH)
    alert("Funcionalidad de guardado aún no implementada.");
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Editar Actividad de Laboratorio</h1>
        {loading ? (
          <div className="text-gray-500">Cargando datos...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Duración (minutos)</label>
                <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ciclo objetivo</label>
                <select name="target_cycle" value={form.target_cycle} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Selecciona...</option>
                  {CYCLES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nivel Bloom</label>
                <select name="bloom_level" value={form.bloom_level} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Selecciona...</option>
                  {BLOOM_LEVELS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tamaño de grupo</label>
                <input type="number" name="group_size" value={form.group_size} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nivel de dificultad (1-5)</label>
                <input type="number" name="difficulty_level" value={form.difficulty_level} onChange={handleChange} className="w-full border rounded px-3 py-2" min={1} max={5} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Imagen de portada (URL)</label>
              <input type="text" name="cover_image_url" value={form.cover_image_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video (URL)</label>
              <input type="text" name="video_url" value={form.video_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recursos adicionales (URLs)</label>
              <div className="flex space-x-2 mb-2">
                <input type="text" value={newResource} onChange={e => setNewResource(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Agregar URL" />
                <Button type="button" variant="secondary" onClick={() => handleAddToList('resource_urls', newResource)}>Agregar</Button>
              </div>
              <ul className="list-disc pl-5">
                {form.resource_urls.map((url, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{url}</span>
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveFromList('resource_urls', idx)}>Eliminar</Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Materiales requeridos (IDs separados por coma)</label>
              <input type="text" name="required_material_ids" value={form.required_material_ids.join(",")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, required_material_ids: e.target.value.split(",").map(x => x.trim()).filter(Boolean) as any })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guía paso a paso (Markdown)</label>
              <textarea name="steps_markdown" value={form.steps_markdown} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guía de evaluación (Markdown)</label>
              <textarea name="assessment_markdown" value={form.assessment_markdown} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Objetivos de aprendizaje</label>
              <div className="flex space-x-2 mb-2">
                <input type="text" value={newObjective} onChange={e => setNewObjective(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Agregar objetivo" />
                <Button type="button" variant="secondary" onClick={() => handleAddToList('learning_objectives', newObjective)}>Agregar</Button>
              </div>
              <ul className="list-disc pl-5">
                {form.learning_objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{obj}</span>
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveFromList('learning_objectives', idx)}>Eliminar</Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiempo de preparación (minutos)</label>
                <input type="number" name="preparation_time_minutes" value={form.preparation_time_minutes} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tiempo de limpieza (minutos)</label>
                <input type="number" name="cleanup_time_minutes" value={form.cleanup_time_minutes} onChange={handleChange} className="w-full border rounded px-3 py-2" min={0} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Autor</label>
                <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Revisor</label>
                <input type="text" name="reviewed_by" value={form.reviewed_by} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Etiquetas</label>
              <div className="flex space-x-2 mb-2">
                <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Agregar etiqueta" />
                <Button type="button" variant="secondary" onClick={() => handleAddToList('tags', newTag)}>Agregar</Button>
              </div>
              <ul className="list-disc pl-5">
                {form.tags.map((tag, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{tag}</span>
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveFromList('tags', idx)}>Eliminar</Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">OA asociados</label>
              <div className="flex space-x-2 mb-2">
                <input type="text" value={newOA} onChange={e => setNewOA(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Agregar OA" />
                <Button type="button" variant="secondary" onClick={() => handleAddToList('oa_ids', newOA)}>Agregar</Button>
              </div>
              <ul className="list-disc pl-5">
                {form.oa_ids.map((oa, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{oa}</span>
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveFromList('oa_ids', idx)}>Eliminar</Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asignatura</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nivel</label>
                <input type="text" name="grade_level" value={form.grade_level} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Indicadores (Markdown)</label>
              <textarea name="indicators_markdown" value={form.indicators_markdown} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" variant="primary">Guardar Cambios</Button>
              <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
} 