/**
 * lib/states.mjs — Single source of truth for canonical statuses.
 *
 * Parses templates/states.yml (labels + aliases) so verify/normalize/merge/dedup
 * never hardcode status lists. All lookups are case-insensitive and tolerate
 * markdown bold and trailing dates in the raw cell value.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CAREER_OPS = new URL('..', import.meta.url).pathname;
const STATES_FILE = existsSync(join(CAREER_OPS, 'templates/states.yml'))
  ? join(CAREER_OPS, 'templates/states.yml')
  : join(CAREER_OPS, 'states.yml');

// Pipeline advancement order by state id (higher = further along).
// Rejected ranks below active states so dedup keeps active duplicates.
export const STATUS_RANK = {
  skip: 0, discarded: 0, rejected: 1, evaluated: 2,
  applied: 3, responded: 4, interview: 5, offer: 6,
};

// Legacy statuses predating states.yml, mapped to a canonical id.
// Kept here (not in states.yml) because they only appear in historical data.
const LEGACY_MAP = {
  'duplicado': 'discarded', 'dup': 'discarded', 'repost': 'discarded',
  'cerrada': 'discarded',
  'condicional': 'evaluated', 'hold': 'evaluated',
  'evaluar': 'evaluated', 'verificar': 'evaluated',
  'geo blocker': 'skip', 'geo-blocker': 'skip',
};

export function loadStates() {
  const text = readFileSync(STATES_FILE, 'utf-8');
  const states = [];
  let current = null;
  for (const line of text.split('\n')) {
    const idM = line.match(/^\s*-\s*id:\s*(\S+)/);
    if (idM) {
      current = { id: idM[1], label: null, aliases: [] };
      states.push(current);
      continue;
    }
    if (!current) continue;
    const labelM = line.match(/^\s*label:\s*(.+?)\s*$/);
    if (labelM) { current.label = labelM[1]; continue; }
    const aliasM = line.match(/^\s*aliases:\s*\[([^\]]*)\]/);
    if (aliasM) current.aliases = aliasM[1].split(',').map(s => s.trim()).filter(Boolean);
  }
  if (states.length === 0) {
    throw new Error(`No states parsed from ${STATES_FILE} — check the file format`);
  }
  return states;
}

const states = loadStates();
const byId = new Map(states.map(s => [s.id, s]));
const lookup = new Map();
for (const st of states) {
  lookup.set(st.id.toLowerCase(), st);
  if (st.label) lookup.set(st.label.toLowerCase(), st);
  for (const a of st.aliases) lookup.set(a.toLowerCase(), st);
}

export const CANONICAL_LABELS = states.map(s => s.label);

function cleanRaw(raw) {
  return String(raw)
    .replace(/\*\*/g, '')
    .replace(/\s+\d{4}-\d{2}-\d{2}.*$/, '')
    .trim();
}

/** Resolve a raw status cell to its state ({id, label, aliases}) or null. */
export function toState(raw) {
  const clean = cleanRaw(raw).toLowerCase();
  const direct = lookup.get(clean);
  if (direct) return direct;
  const legacyId = LEGACY_MAP[clean];
  return legacyId ? byId.get(legacyId) : null;
}

/** Canonical label for a raw status cell, or null if unknown. */
export function toLabel(raw) {
  const s = toState(raw);
  return s ? s.label : null;
}

/** Canonical label for a state id (e.g. labelFor('discarded') → 'Discarded'). */
export function labelFor(id) {
  const s = byId.get(id);
  if (!s) throw new Error(`Unknown state id "${id}"`);
  return s.label;
}

/** Pipeline rank for a raw status cell (0 if unknown). */
export function statusRank(raw) {
  const s = toState(raw);
  return s ? (STATUS_RANK[s.id] ?? 0) : 0;
}

/** True when the cleaned raw value already equals the canonical label. */
export function isCanonicalLabel(raw) {
  const s = toState(raw);
  return s !== null && cleanRaw(raw) === s.label;
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Matches any known status (label, alias, id, or legacy) at the start of a string. */
export const STATUS_PREFIX_RE = new RegExp(
  '^(' + [...new Set([...lookup.keys(), ...Object.keys(LEGACY_MAP)])].map(escapeRe).join('|') + ')',
  'i'
);
