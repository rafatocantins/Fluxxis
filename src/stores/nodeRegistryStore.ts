/**
 * Node Registry Store
 *
 * Manages registered smart component nodes and their goals
 */

import { create } from 'zustand';
import type { GoalType } from '../types';
import type { NodeContract } from '../registry/types';

export interface NodeRegistryState {
  /** Map of registered nodes */
  nodes: Map<string, NodeContract>;
  /** Node IDs by goal type */
  nodesByGoal: Record<GoalType, string[]>;
}

interface NodeRegistryActions {
  /** Register a new node */
  registerNode: (node: NodeContract) => void;
  /** Deregister a node */
  deregisterNode: (nodeId: string) => void;
  /** Get node by ID */
  getNode: (nodeId: string) => NodeContract | undefined;
  /** Get nodes by goal */
  getNodesByGoal: (goal: GoalType) => NodeContract[];
  /** Update node metrics */
  updateNodeMetrics: (nodeId: string, metrics: Partial<NodeContract['metrics']>) => void;
  /** Clear all nodes */
  clearNodes: () => void;
}

const initialState: NodeRegistryState = {
  nodes: new Map(),
  nodesByGoal: {
    convert: [],
    inform: [],
    engage: [],
  },
};

export const useNodeRegistryStore = create<NodeRegistryState & NodeRegistryActions>()(
  (set, get) => ({
    ...initialState,

    registerNode: (node) =>
      set((state) => {
        const newNodes = new Map(state.nodes);
        newNodes.set(node.id, node);

        const nodesByGoal = { ...state.nodesByGoal };
        if (!nodesByGoal[node.goal].includes(node.id)) {
          nodesByGoal[node.goal] = [...nodesByGoal[node.goal], node.id];
        }

        return { nodes: newNodes, nodesByGoal };
      }),

    deregisterNode: (nodeId) =>
      set((state) => {
        const node = state.nodes.get(nodeId);
        if (!node) {
          return state;
        }

        const newNodes = new Map(state.nodes);
        newNodes.delete(nodeId);

        const nodesByGoal = { ...state.nodesByGoal };
        nodesByGoal[node.goal] = nodesByGoal[node.goal].filter((id) => id !== nodeId);

        return { nodes: newNodes, nodesByGoal };
      }),

    getNode: (nodeId) => get().nodes.get(nodeId),

    getNodesByGoal: (goal) => {
      const state = get();
      return state.nodesByGoal[goal]
        .map((id) => state.nodes.get(id))
        .filter(Boolean) as NodeContract[];
    },

    updateNodeMetrics: (nodeId, metrics) =>
      set((state) => {
        const node = state.nodes.get(nodeId);
        if (!node) {
          return state;
        }

        const updatedNode: NodeContract = {
          ...node,
          metrics: { ...node.metrics, ...metrics },
        };

        const newNodes = new Map(state.nodes);
        newNodes.set(nodeId, updatedNode);

        return { nodes: newNodes };
      }),

    clearNodes: () => set(initialState),
  })
);
