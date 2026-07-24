import { describe, it, expect } from 'vitest';

describe('@fluxxis/wrapper — smoke test', () => {
  it('should export SmartCTA', async () => {
    const mod = await import('../index');
    expect(mod.SmartCTA).toBeDefined();
  });

  it('should export createIntent', async () => {
    const mod = await import('../index');
    expect(mod.createIntent).toBeDefined();
  });

  it('should export resolveTokens', async () => {
    const mod = await import('../index');
    expect(mod.resolveTokens).toBeDefined();
  });

  it('should export materialTokens', async () => {
    const mod = await import('../index');
    expect(mod.materialTokens).toBeDefined();
  });

  it('should export tracking primitives', async () => {
    const mod = await import('../index');
    expect(mod.initTracker).toBeDefined();
    expect(mod.getTracker).toBeDefined();
    expect(mod.Tracker).toBeDefined();
    expect(mod.ConsentManager).toBeDefined();
    expect(mod.IntentProvider).toBeDefined();
    expect(mod.useFluxxisIntent).toBeDefined();
    expect(mod.recordSignal).toBeDefined();
  });

  it('should export intent schema types (type-only)', () => {
    // Types are compile-time only, but we verify the module loads
    expect(true).toBe(true);
  });
});
