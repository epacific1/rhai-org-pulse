const { getDirectReports } = require('../../../shared/server/permissions');

/**
 * Compute the teams a manager has purview over based on their
 * direct reports' team assignments.
 * @param {string} managerUid
 * @param {object} registry - { people: { uid: { managerUid, teamIds, _appFields, ... } } }
 * @param {object} teamsData - { teams: { teamId: { id, name, orgKey, metadata, ... } } }
 * @returns {{ directReportUids: string[], teams: Array<{ id, name, orgKey, directReportUids: string[], totalMemberCount: number, metadata: object, boards: Array }> }}
 */
function getManagerPurview(managerUid, registry, teamsData) {
  const directReportUidSet = getDirectReports(managerUid, registry);
  const directReportUids = [...directReportUidSet];

  if (!teamsData || !teamsData.teams) {
    return { directReportUids, teams: [] };
  }

  // Build a map: teamId -> list of direct report UIDs on that team
  const teamDirectReports = new Map();
  for (const uid of directReportUids) {
    const person = registry.people[uid];
    if (!person || !Array.isArray(person.teamIds)) continue;
    for (const teamId of person.teamIds) {
      if (!teamDirectReports.has(teamId)) {
        teamDirectReports.set(teamId, []);
      }
      teamDirectReports.get(teamId).push(uid);
    }
  }

  // Build a map: teamId -> total member count (all people assigned to the team)
  const teamMemberCounts = new Map();
  if (registry && registry.people) {
    for (const person of Object.values(registry.people)) {
      if (person.status !== 'active') continue;
      if (!Array.isArray(person.teamIds)) continue;
      for (const teamId of person.teamIds) {
        teamMemberCounts.set(teamId, (teamMemberCounts.get(teamId) || 0) + 1);
      }
    }
  }

  // Build the teams array from teams where at least one direct report is assigned
  const teams = [];
  for (const [teamId, reportUids] of teamDirectReports.entries()) {
    const teamObj = teamsData.teams[teamId];
    if (!teamObj) continue;
    teams.push({
      id: teamObj.id,
      name: teamObj.name,
      orgKey: teamObj.orgKey,
      directReportUids: reportUids,
      totalMemberCount: teamMemberCounts.get(teamId) || 0,
      metadata: teamObj.metadata || {},
      boards: teamObj.boards || []
    });
  }

  return { directReportUids, teams };
}

module.exports = { getManagerPurview };
