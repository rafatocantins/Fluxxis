/**
 * JSON-LD Intent Signal Generator
 *
 * Produces a machine-readable JSON-LD document (`@type: IntentSignal`)
 * describing detected intents, template bindings, and the actor
 * (human or agent), for consumption by AI crawlers and agents.
 *
 * Embed the result inside a `<script type="application/ld+json">` tag so
 * agents can discover how the interface intends to adapt.
 */

import type { GoalType, ActorType, Signal } from '../types';
import type { IntentMatch } from '../intents/types';
import { detectActorType } from '../signals/agentDetection';
import { DEFAULT_SCHEMA_CONTEXT } from './types';

/**
 * A template binding that links a detected intent to a template.
 */
export interface IntentSignalBinding {
  /** Detected goal/intent */
  intent: GoalType;
  /** Template identifier */
  templateId: string;
  /** Binding confidence (0-1) */
  confidence: number;
}

/**
 * JSON-LD document describing detected intents for AI agents.
 */
export interface IntentSignalDocument {
  '@context': string;
  '@type': 'IntentSignal';
  name: string;
  intents: GoalType[];
  templates: IntentSignalBinding[];
  bindings: IntentSignalBinding[];
  actor: { type: ActorType; confidence: number; reasons: string[] };
  generatedAt: string;
}

/**
 * Input for {@link generateIntentSignal}.
 */
export interface GenerateIntentSignalInput {
  /** Behavioral signals used to detect the actor (human/agent) */
  signals?: Signal[];
  /** Explicit intent matches (goals + confidence) */
  intents?: IntentMatch[];
  /** Template bindings keyed by intent */
  templates?: IntentSignalBinding[];
  /** Optional document name */
  name?: string;
}

/**
 * Generate a JSON-LD intent signal document for AI agents.
 *
 * The document describes the detected intents, template bindings, and the
 * detected actor (human or agent). It is intended to be embedded in a
 * `<script type="application/ld+json">` tag so AI crawlers and agents can
 * discover how the interface intends to adapt.
 *
 * @param input Optional configuration (signals, intents, templates, name)
 * @returns A JSON-LD `IntentSignal` document
 */
export function generateIntentSignal(
  input: GenerateIntentSignalInput = {}
): IntentSignalDocument {
  const signals = input.signals ?? [];

  // Detect the actor from behavioral signals. With no signals there is no
  // evidence for either actor, so we report `unknown`.
  let actor: IntentSignalDocument['actor'];
  if (signals.length === 0) {
    actor = {
      type: 'unknown',
      confidence: 0,
      reasons: ['No interaction signals detected'],
    };
  } else {
    const detection = detectActorType(signals);
    actor = {
      type: detection.actorType,
      confidence: detection.confidence,
      reasons: detection.reasons,
    };
  }

  // Collect unique intents in first-seen order, then fall back to deriving
  // goals from signals when no explicit intent matches were provided.
  const intents: GoalType[] = [];
  const seen = new Set<GoalType>();

  for (const match of input.intents ?? []) {
    if (!seen.has(match.goal)) {
      seen.add(match.goal);
      intents.push(match.goal);
    }
  }

  if (intents.length === 0) {
    for (const signal of signals) {
      const goal = signal.intent?.goal;
      if (goal && !seen.has(goal)) {
        seen.add(goal);
        intents.push(goal);
      }
    }
  }

  const templates = input.templates ?? [];

  return {
    '@context': DEFAULT_SCHEMA_CONTEXT,
    '@type': 'IntentSignal',
    name: input.name ?? 'fluxxis-intent-signal',
    intents,
    templates,
    bindings: templates,
    actor,
    generatedAt: new Date().toISOString(),
  };
}
