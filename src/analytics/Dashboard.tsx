/**
 * Analytics Dashboard Component
 * 
 * Displays agent analytics and usage statistics
 */

import React, { useState, useEffect } from 'react';
import type { DashboardData, AgentStats, UsageData } from './types';
import { createAnalyticsLogger } from './logger';

/**
 * Dashboard props
 */
export interface AnalyticsDashboardProps {
  /** Refresh interval (ms) */
  refreshInterval?: number;
  /** Show revenue data */
  showRevenue?: boolean;
  /** Show agent details */
  showAgentDetails?: boolean;
  /** Custom logger instance */
  logger?: ReturnType<typeof createAnalyticsLogger>;
}

/**
 * Analytics Dashboard
 */
export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  refreshInterval = 5000,
  showRevenue = true,
  showAgentDetails = true,
  logger,
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create or use provided logger
  const analyticsLogger = logger || createAnalyticsLogger();

  // Fetch dashboard data
  const fetchDashboardData = () => {
    try {
      const data = analyticsLogger.getDashboardData();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval) {
      return;
    }

    const interval = setInterval(fetchDashboardData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Loading state
  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="analytics-dashboard error">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="analytics-dashboard no-data">
        <div className="no-data-message">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1>Agent Analytics Dashboard</h1>
        <button onClick={fetchDashboardData} className="refresh-button">
          Refresh
        </button>
      </header>

      {/* Key Metrics */}
      <section className="metrics-section">
        <div className="metric-card">
          <h3>Total Agents</h3>
          <div className="metric-value">{dashboardData.totalAgents}</div>
          <div className="metric-subtitle">
            {dashboardData.activeAgents} active (24h)
          </div>
        </div>

        <div className="metric-card">
          <h3>Total Requests</h3>
          <div className="metric-value">{dashboardData.totalRequests.toLocaleString()}</div>
          <div className="metric-subtitle">
            {dashboardData.requests24h.toLocaleString()} (24h) | {dashboardData.requests30d.toLocaleString()} (30d)
          </div>
        </div>

        {showRevenue && (
          <div className="metric-card">
            <h3>Total Revenue</h3>
            <div className="metric-value">{dashboardData.totalRevenue.toFixed(2)}€</div>
            <div className="metric-subtitle">
              {dashboardData.revenue30d.toFixed(2)}€ (30d)
            </div>
          </div>
        )}

        <div className="metric-card">
          <h3>Avg Latency</h3>
          <div className="metric-value">{dashboardData.avgLatency.toFixed(0)}ms</div>
          <div className="metric-subtitle">Target: &lt;500ms</div>
        </div>

        <div className="metric-card">
          <h3>Success Rate</h3>
          <div className="metric-value">{(dashboardData.successRate * 100).toFixed(1)}%</div>
          <div className="metric-subtitle">Target: &gt;99%</div>
        </div>
      </section>

      {/* Agent Details */}
      {showAgentDetails && dashboardData.topAgents.length > 0 && (
        <section className="agents-section">
          <h2>Top Agents</h2>
          <table className="agents-table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Tier</th>
                <th>Requests</th>
                <th>Success Rate</th>
                <th>Latency</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topAgents.map((agent) => (
                <AgentRow key={agent.agentId} agent={agent} />
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Tier Distribution */}
      <section className="tiers-section">
        <h2>Requests by Tier</h2>
        <div className="tier-bars">
          {Object.entries(dashboardData.requestsByTier).map(([tier, count]) => (
            <TierBar
              key={tier}
              tier={tier as string}
              count={count}
              total={dashboardData.totalRequests}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

/**
 * Agent row component
 */
const AgentRow: React.FC<{ agent: AgentStats }> = ({ agent }) => {
  return (
    <tr>
      <td className="agent-id">{agent.agentId.substring(0, 12)}...</td>
      <td className="tier">
        <span className={`tier-badge tier-${agent.tier}`}>{agent.tier}</span>
      </td>
      <td className="requests">{agent.totalRequests.toLocaleString()}</td>
      <td className="success-rate">
        {(agent.successRate * 100).toFixed(1)}%
      </td>
      <td className="latency">{agent.avgLatency.toFixed(0)}ms</td>
      <td className="revenue">{agent.totalLicensingFees.toFixed(2)}€</td>
    </tr>
  );
};

/**
 * Tier bar component
 */
const TierBar: React.FC<{ tier: string; count: number; total: number }> = ({
  tier,
  count,
  total,
}) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="tier-bar">
      <div className="tier-label">{tier}</div>
      <div className="tier-progress">
        <div
          className={`tier-fill tier-${tier}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="tier-count">{count.toLocaleString()} ({percentage.toFixed(1)}%)</div>
    </div>
  );
};

export default AnalyticsDashboard;
