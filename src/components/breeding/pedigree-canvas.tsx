"use client"

import {
    Background,
    Controls,
    Handle,
    Position,
    ReactFlow,
    type Edge,
    type Node,
    type NodeProps,
} from "@xyflow/react"
import { animalLabel, type PedigreeAnimal } from "@/src/app/[labId]/breeding/types"
import "@xyflow/react/dist/style.css"
import Link from "next/link"

type AnimalNodeData = {
    href: string
    label: string
    meta: string
    current: boolean
}

function AnimalNode({ data }: NodeProps<Node<AnimalNodeData>>) {
    return (
        <Link
            href={data.href}
            className={`block w-[180px] rounded-lg border px-3 py-2 shadow-sm ${data.current ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
        >
            <Handle type="target" position={Position.Top} className="!bg-blue-600" />
            <p className="truncate text-sm font-medium text-gray-900">{data.label}</p>
            <p className="truncate text-xs text-gray-500">{data.meta}</p>
            <Handle type="source" position={Position.Bottom} className="!bg-blue-600" />
        </Link>
    )
}

const nodeTypes = { animal: AnimalNode }

function placeRow(animals: PedigreeAnimal[], y: number, labId: string, currentId: string): Node<AnimalNodeData>[] {
    const gap = 210
    const origin = -((animals.length - 1) * gap) / 2
    return animals.map((animal, index) => ({
        id: `${y}-${animal.id}`,
        type: "animal",
        position: { x: origin + index * gap, y },
        data: {
            href: `/${labId}/animals/${animal.id}`,
            label: animalLabel(animal),
            meta: [animal.identifier, animal.sex, animal.animalType].filter(Boolean).join(" · "),
            current: animal.id === currentId,
        },
    }))
}

export function PairCanvas({
    labId,
    mother,
    father,
    offspring,
}: {
    labId: string
    mother: PedigreeAnimal
    father: PedigreeAnimal
    offspring: PedigreeAnimal[]
}) {
    const parents = placeRow([mother, father], 0, labId, "")
    const children = placeRow(offspring, 200, labId, "")
    const edges: Edge[] = offspring.flatMap((child) => [
        { id: `m-${child.id}`, source: `0-${mother.id}`, target: `200-${child.id}` },
        { id: `f-${child.id}`, source: `0-${father.id}`, target: `200-${child.id}` },
    ])

    return (
        <div className="h-[420px] w-full overflow-hidden rounded-lg border bg-gray-50">
            <ReactFlow nodes={[...parents, ...children]} edges={edges} nodeTypes={nodeTypes} fitView>
                <Background />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    )
}

export function PedigreeCanvas({
    labId,
    current,
    parents,
    offspring,
}: {
    labId: string
    current: PedigreeAnimal
    parents: PedigreeAnimal[]
    offspring: PedigreeAnimal[]
}) {
    if (parents.length === 0 && offspring.length === 0) {
        return <p className="text-sm text-gray-500">No parents or offspring are recorded for this animal.</p>
    }

    const nodes = [
        ...placeRow(parents, 0, labId, current.id),
        ...placeRow([current], 160, labId, current.id),
        ...placeRow(offspring, 320, labId, current.id),
    ]
    const edges: Edge[] = [
        ...parents.map((parent) => ({
            id: `p-${parent.id}`,
            source: `0-${parent.id}`,
            target: `160-${current.id}`,
        })),
        ...offspring.map((child) => ({
            id: `c-${child.id}`,
            source: `160-${current.id}`,
            target: `320-${child.id}`,
        })),
    ]

    return (
        <div className="h-[420px] w-full overflow-hidden rounded-lg border bg-gray-50">
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
                <Background />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    )
}
