/**
 * Node Registry
 *
 * Manages registration and lifecycle of smart component nodes
 */

import { eventBus } from '../events/EventBus';
import type { NodeContract, NodeMetrics, InterventionLevel } from './types';
import { createInitialMetrics, shouldProtect } from './types';

/**
 * Node Registry class for managing smart component nodes
 */
export class NodeRegistry {
  private nodes: Map<string, NodeContract> = new Map();
  private nodesByGoal: Map<string, string[]> = new Map();
  private nodesBySection: Map<string, string[]> = new Map();

  constructor() {
    // Initialize goal maps
    this.nodesByGoal.set('convert', []);
    this.nodesByGoal.set('inform', []);
    this.nodesByGoal.set('engage', []);
  }

  /**
   * Register a new node
   */
  register(node: Omit<NodeContract, 'metrics' | 'protectionLevel' | 'isProtected'>): NodeContract {
    const metrics = createInitialMetrics();
    const protectionLevel: InterventionLevel = 1;
    const isProtected = false;

    const nodeContract: NodeContract = {
      ...node,
      metrics,
      protectionLevel,
      isProtected,
    };

    // Store node
    this.nodes.set(node.id, nodeContract);

    // Index by goal
    const goalNodes = this.nodesByGoal.get(node.goal) ?? [];
    goalNodes.push(node.id);
    this.nodesByGoal.set(node.goal, goalNodes);

    // Index by section
    if (node.sectionId) {
      const sectionNodes = this.nodesBySection.get(node.sectionId) ?? [];
      sectionNodes.push(node.id);
      this.nodesBySection.set(node.sectionId, sectionNodes);
    }

    // Emit registration event (void to ignore promise)
    void eventBus.publish('NODE_REGISTER', { node: nodeContract }, 'NodeRegistry');

    return nodeContract;
  }

  /**
   * Deregister a node
   */
  deregister(nodeId: string, reason?: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return;
    }

    // Remove from main map
    this.nodes.delete(nodeId);

    // Remove from goal index
    const goalNodes = this.nodesByGoal.get(node.goal) ?? [];
    const filtered = goalNodes.filter((id) => id !== nodeId);
    this.nodesByGoal.set(node.goal, filtered);

    // Remove from section index
    if (node.sectionId) {
      const sectionNodes = this.nodesBySection.get(node.sectionId) ?? [];
      const sectionFiltered = sectionNodes.filter((id) => id !== nodeId);
      this.nodesBySection.set(node.sectionId, sectionFiltered);
    }

    // Emit deregistration event (void to ignore promise)
    void eventBus.publish('NODE_DEREGISTER', { nodeId, reason }, 'NodeRegistry');
  }

  /**
   * Get node by ID
   */
  getNode(nodeId: string): NodeContract | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Get nodes by goal type
   */
  getNodesByGoal(goal: string): NodeContract[] {
    const nodeIds = this.nodesByGoal.get(goal) ?? [];
    return nodeIds.map((id) => this.nodes.get(id)).filter(Boolean) as NodeContract[];
  }

  /**
   * Get nodes by section
   */
  getNodesBySection(sectionId: string): NodeContract[] {
    const nodeIds = this.nodesBySection.get(sectionId) ?? [];
    return nodeIds.map((id) => this.nodes.get(id)).filter(Boolean) as NodeContract[];
  }

  /**
   * Update node metrics
   */
  updateMetrics(nodeId: string, metrics: Partial<NodeMetrics>): void {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return;
    }

    const updatedMetrics = { ...node.metrics, ...metrics };

    // Calculate performance above baseline
    if (updatedMetrics.baseline > 0) {
      updatedMetrics.performanceAboveBaseline =
        (updatedMetrics.current - updatedMetrics.baseline) / updatedMetrics.baseline;
    }

    // Update protection status
    const isProtected = shouldProtect(updatedMetrics);

    const updatedNode: NodeContract = {
      ...node,
      metrics: updatedMetrics,
      isProtected,
    };

    this.nodes.set(nodeId, updatedNode);
  }

  /**
   * Get all registered nodes
   */
  getAllNodes(): NodeContract[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get node count
   */
  getNodeCount(): number {
    return this.nodes.size;
  }

  /**
   * Clear all nodes
   */
  clear(): void {
    this.nodes.clear();
    this.nodesByGoal.clear();
    this.nodesBySection.clear();
  }
}

// Singleton instance
export const nodeRegistry = new NodeRegistry();
