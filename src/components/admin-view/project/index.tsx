"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import type { FormControl, Project, ProjectData } from "@/types";
import { sortByOrderThenUpdated } from "@/lib/sort";
import Image from "next/image";
import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";
import ImageUpload from "../image-upload";

const controls: FormControl[] = [
  {
    name: "name",
    placeholder: "e.g. Lead Marketing Global",
    type: "text",
    label: "Project Name",
  },
  {
    name: "technologies",
    placeholder: "e.g. React JS, Tailwind CSS, MongoDB",
    type: "text",
    label: "Enter Technologies",
    helperText: "Comma-separated; each item becomes a tag on the card.",
  },
  {
    name: "website",
    placeholder: "e.g. https://example.com",
    type: "url",
    label: "Website",
    helperText: "Full URL including https://",
  },
  {
    name: "github",
    placeholder: "e.g. https://github.com/Talat09/repo-name",
    type: "url",
    label: "github",
    helperText: "Full URL. Leave empty to hide the Github button.",
  },
];

function SortableProjectCard({
  item,
  index,
  highlighted,
  children,
}: {
  item: Project & { _id: string };
  index: number;
  highlighted: boolean;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={`relative flex flex-col rounded-xl border p-4 pl-12 text-sm ${
        isDragging ? "shadow-xl opacity-90" : ""
      } ${
        highlighted
          ? "border-[#1a9e55] bg-[#e8f6ee]"
          : "border-[#e3efe8] bg-[#f8fcfa]"
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${item.name} (position ${index + 1})`}
        className="absolute left-2 top-3 flex h-8 w-8 cursor-grab touch-none items-center justify-center rounded-md text-[#6b7280] hover:bg-[#e8f6ee] hover:text-[#1a9e55] active:cursor-grabbing"
      >
        <MdDragIndicator className="h-5 w-5" aria-hidden="true" />
      </button>
      <span className="absolute right-3 top-3 rounded-full bg-white-500 px-2 py-0.5 text-[11px] font-semibold text-[#6b7280] border border-[#e3efe8]">
        #{index + 1}
      </span>
      {children}
    </li>
  );
}

export default function AdminProjectView({
  formData,
  setFormData,
  handleSaveData,
  data,
  editingProjectId,
  handleEditProject,
  handleCancelEditProject,
  handleDeleteProject,
  handleSaveOrder,
}: {
  formData: ProjectData;
  setFormData: (data: ProjectData) => void;
  handleSaveData: (tab?: string) => void;
  data?: Project[];
  editingProjectId: string | null;
  handleEditProject: (item: Project) => void;
  handleCancelEditProject: () => void;
  handleDeleteProject: (item: Project) => void;
  handleSaveOrder: (ids: string[]) => Promise<boolean>;
}) {
  const isEditing = Boolean(editingProjectId);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Projects in the same order the homepage shows them
  const savedOrder = useMemo(
    () =>
      sortByOrderThenUpdated(data).filter(
        (item): item is Project & { _id: string } => Boolean(item._id)
      ),
    [data]
  );
  const [orderedItems, setOrderedItems] = useState(savedOrder);
  const [savingOrder, setSavingOrder] = useState(false);

  const [prevSavedOrder, setPrevSavedOrder] = useState(savedOrder);
  if (savedOrder !== prevSavedOrder) {
    setPrevSavedOrder(savedOrder);
    setOrderedItems(savedOrder);
  }

  const orderChanged =
    orderedItems.length === savedOrder.length &&
    orderedItems.some((item, i) => item._id !== savedOrder[i]?._id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedItems((items) => {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over.id);
      if (oldIndex === -1 || newIndex === -1) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  async function onSaveOrder() {
    setSavingOrder(true);
    await handleSaveOrder(orderedItems.map((item) => item._id));
    setSavingOrder(false);
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard
        pill={isEditing ? "EDITING" : "MY WORK"}
        title={isEditing ? "Edit Project" : "Projects"}
        description={
          isEditing
            ? "Change the fields and click Update Project."
            : "Add a project. Technologies are comma-separated."
        }
      >
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <ImageUpload
          key={editingProjectId || "new"}
          value={formData.image || ""}
          onChange={(url) => setFormData({ ...formData, image: url })}
          onUploadingChange={setUploadingImage}
        />
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <button
              type="button"
              onClick={handleCancelEditProject}
              className="rounded-lg border-[1.5px] border-[#d1d5db] px-6 py-3 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleSaveData("project")}
            disabled={uploadingImage}
            className={` disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {uploadingImage ? "Uploading image..." : isEditing ? "Update Project" : "Add Info"}
          </button>
        </div>
      </AdminCard>
      <AdminCard
        pill="SAVED"
        title="Existing entries"
        description="Drag the handle (or focus it and use Space + arrow keys) to reorder. This is the order shown on the homepage; the first 4 are visible by default."
      >
        {orderChanged ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1a9e55] bg-[#e8f6ee] px-4 py-3">
            <p className="text-sm font-medium text-[#0f7a3d]">
              Order changed - save it to update the homepage.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrderedItems(savedOrder)}
                disabled={savingOrder}
                className="rounded-lg border-[1.5px] border-[#d1d5db] bg-white-500 px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onSaveOrder}
                disabled={savingOrder}
                className={`${primaryButtonClass} !px-4 !py-2`}
              >
                {savingOrder ? "Saving..." : "Save Order"}
              </button>
            </div>
          </div>
        ) : null}
        {orderedItems.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedItems.map((item) => item._id)}
              strategy={rectSortingStrategy}
            >
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderedItems.map((item, i) => (
                  <SortableProjectCard
                    key={item._id}
                    item={item}
                    index={i}
                    highlighted={editingProjectId === item._id}
                  >
                    {item.image ? (
                      <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg border border-[#e3efe8] bg-white-500">
                        <Image src={item.image} alt="" fill sizes="(min-width: 768px) 320px, 90vw" unoptimized className="object-cover" />
                      </div>
                    ) : null}
                    <p className="font-bold text-[#111827] break-words pr-10">{item.name}</p>
                    <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">technologies:</span> {item.technologies}</p>
                    <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">website:</span> {item.website}</p>
                    <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">github:</span> {item.github}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditProject(item)}
                        className="rounded-lg border-[1.5px] border-[#1a9e55] px-4 py-1.5 text-xs font-semibold text-[#1a9e55] hover:bg-[#e8f6ee] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(item)}
                        className="rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] px-4 py-1.5 text-xs font-semibold text-white-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </SortableProjectCard>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-sm text-[#6b7280]">No entries yet.</p>
        )}
      </AdminCard>
    </div>
  );
}
